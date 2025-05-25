
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'; 
import { DUMMY_FAMILY_GROUPS, DUMMY_CONTACTS } from '@/lib/dummy-data';
import type { FamilyGroup, Contact, LabeledAddress } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Users, Edit2, Trash2, Search, ChevronDown, ChevronRight, Eye, Share2, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

interface GroupWithHierarchy extends FamilyGroup {
  children?: GroupWithHierarchy[];
  level: number;
  memberCount: number;
  subGroupCount: number;
}

const getAllDescendantGroupIds = (groupId: string, allGroupsData: FamilyGroup[]): string[] => {
  const ids: Set<string> = new Set();
  const queue: string[] = [groupId];
  const visitedInTraversal: Set<string> = new Set(); 

  while (queue.length > 0) {
    const currentGroupId = queue.shift()!; 

    if (visitedInTraversal.has(currentGroupId)) {
      continue; 
    }
    visitedInTraversal.add(currentGroupId);
    ids.add(currentGroupId);

    const children = allGroupsData.filter(g => g.parentId === currentGroupId);
    for (const child of children) {
      if (child.id && !visitedInTraversal.has(child.id)) { 
        queue.push(child.id);
      }
    }
  }
  return Array.from(ids);
};


const getFullMemberCount = (
  groupId: string,
  allGroups: FamilyGroup[],
  allContacts: Contact[]
): number => {
  const relevantGroupIds = getAllDescendantGroupIds(groupId, allGroups);
  return allContacts.filter(contact => 
    contact.groupIds?.some(cgId => relevantGroupIds.includes(cgId))
  ).length;
};

export default function FamilyGroupsPage() {
  const router = useRouter(); 
  const pathname = usePathname();
  const [groups, setGroups] = useState<FamilyGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<FamilyGroup | null>(null);
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupParentId, setNewGroupParentId] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<FamilyGroup | null>(null);


  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setGroups([...DUMMY_FAMILY_GROUPS].sort((a,b) => a.name.localeCompare(b.name)));
      setIsLoading(false);
    }, 500);
  }, [pathname]); 

  const handleAddOrUpdateGroup = async () => {
    if (!newGroupName.trim()) {
      toast({ title: "Group name required", description: "Please enter a valid name for the group.", variant: "destructive" });
      return;
    }
    setIsSubmittingModal(true);
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API

    if (editingGroup) {
      const groupIndexInGlobal = DUMMY_FAMILY_GROUPS.findIndex(g => g.id === editingGroup.id);
      if (groupIndexInGlobal !== -1) {
        DUMMY_FAMILY_GROUPS[groupIndexInGlobal] = { 
          ...DUMMY_FAMILY_GROUPS[groupIndexInGlobal], 
          name: newGroupName, 
          description: newGroupDescription, 
          parentId: newGroupParentId 
        };
      }
      toast({ title: "Group Updated", description: `Group "${newGroupName}" updated successfully.`, className: "bg-accent text-accent-foreground" });
    } else {
      const newGroupData: FamilyGroup = {
        id: `group-${Date.now()}-${Math.random().toString(36).substring(2,7)}`,
        name: newGroupName,
        description: newGroupDescription,
        parentId: newGroupParentId,
        members: [], 
      };
      DUMMY_FAMILY_GROUPS.push(newGroupData);
      toast({ title: "Group Created", description: `Group "${newGroupName}" created successfully.`, className: "bg-accent text-accent-foreground" });
    }
    setGroups([...DUMMY_FAMILY_GROUPS].sort((a,b) => a.name.localeCompare(b.name))); 
    setIsSubmittingModal(false);
    closeModal();
  };

  const openModalForEdit = (group: FamilyGroup) => {
    setEditingGroup(group);
    setNewGroupName(group.name);
    setNewGroupDescription(group.description || '');
    setNewGroupParentId(group.parentId);
    setIsModalOpen(true);
  };

  const openModalForNew = (parentId?: string) => {
    setEditingGroup(null);
    setNewGroupName('');
    setNewGroupDescription('');
    setNewGroupParentId(parentId);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingGroup(null);
    setNewGroupName('');
    setNewGroupDescription('');
    setNewGroupParentId(undefined);
    setIsSubmittingModal(false);
  };

  const confirmDeleteGroup = (group: FamilyGroup) => {
    setGroupToDelete(group);
    setIsConfirmDeleteDialogOpen(true);
  };

  const executeDeleteGroup = async () => {
    if (!groupToDelete) return;
    setIsSubmittingModal(true); // Use same flag for delete operation
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API

    const childrenOfDeleted = DUMMY_FAMILY_GROUPS.filter(g => g.parentId === groupToDelete.id);
    childrenOfDeleted.forEach(child => {
      const childIndexInGlobal = DUMMY_FAMILY_GROUPS.findIndex(g => g.id === child.id);
      if (childIndexInGlobal !== -1) {
        DUMMY_FAMILY_GROUPS[childIndexInGlobal].parentId = groupToDelete.parentId; 
      }
    });
    
    const groupIndex = DUMMY_FAMILY_GROUPS.findIndex(g => g.id === groupToDelete.id);
    if (groupIndex > -1) {
      DUMMY_FAMILY_GROUPS.splice(groupIndex, 1);
    }
    
    setGroups([...DUMMY_FAMILY_GROUPS].sort((a,b) => a.name.localeCompare(b.name))); 
    
    toast({ title: "Group Deleted", description: `Group "${groupToDelete.name}" deleted. Subgroups (if any) were re-parented.`, variant: "default" });
    setIsConfirmDeleteDialogOpen(false);
    setGroupToDelete(null);
    setIsSubmittingModal(false);
  };

  const toggleExpand = (groupId: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };
  
  const buildGroupHierarchy = (allCurrentGroups: FamilyGroup[], allContacts: Contact[], parentId?: string, level = 0): GroupWithHierarchy[] => {
    return allCurrentGroups
      .filter(group => group.parentId === parentId)
      .sort((a, b) => a.name.localeCompare(b.name)) 
      .map(group => {
        const children = buildGroupHierarchy(allCurrentGroups, allContacts, group.id, level + 1);
        const memberCount = getFullMemberCount(group.id, allCurrentGroups, allContacts);
        const subGroupCount = children.length;
        return {
          ...group,
          level,
          children,
          memberCount,
          subGroupCount,
        };
      });
  };

  const filterHierarchyForDisplay = (hierarchy: GroupWithHierarchy[], term: string): GroupWithHierarchy[] => {
    if (!term.trim()) return hierarchy;
    const lowerTerm = term.toLowerCase();

    return hierarchy.reduce((acc, group) => {
      const selfMatches = group.name.toLowerCase().includes(lowerTerm) ||
                          (group.description || '').toLowerCase().includes(lowerTerm);
      
      const filteredChildren = group.children ? filterHierarchyForDisplay(group.children, term) : [];

      if (selfMatches || filteredChildren.length > 0) {
        acc.push({ ...group, children: filteredChildren.length > 0 ? filteredChildren : (selfMatches ? [] : undefined) });
      }
      return acc;
    }, [] as GroupWithHierarchy[]);
  };
  
  const fullHierarchy = buildGroupHierarchy(groups, DUMMY_CONTACTS);
  const displayedGroupsHierarchy = filterHierarchyForDisplay(fullHierarchy, searchTerm);

  const handleViewContacts = (groupId: string) => {
    router.push(`/?groupId=${groupId}`);
  };

  const formatSingleAddressForShare = (address?: LabeledAddress) => {
    if (!address) return null;
    const parts = [address.street, address.city, address.state, address.zip, address.country].filter(Boolean);
    return parts.join(', ');
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: `${type} Copied`,
        description: `Details for "${type}" copied to clipboard.`,
        className: "bg-accent text-accent-foreground",
      });
    } catch (err) {
      toast({
        title: `Failed to Copy ${type}`,
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleShareGroup = async (group: GroupWithHierarchy) => {
    const relevantGroupIds = getAllDescendantGroupIds(group.id, groups);
    const memberContacts = DUMMY_CONTACTS.filter(contact => 
      contact.groupIds?.some(cgId => relevantGroupIds.includes(cgId))
    );

    let shareText = `Group: ${group.name}\n`;
    if (group.description) {
      shareText += `Description: ${group.description}\n`;
    }
    shareText += `Total Members (including subgroups): ${group.memberCount}\n\n--- Members ---\n`;

    if (memberContacts.length > 0) {
      memberContacts.forEach(contact => {
        shareText += `\nName: ${contact.name}\nPhone: ${contact.phoneNumber}`;
        if (contact.email) shareText += `\nEmail: ${contact.email}`;
        if (contact.addresses && contact.addresses.length > 0) {
          contact.addresses.forEach(addr => {
            const formattedAddr = formatSingleAddressForShare(addr);
            if (formattedAddr) {
                shareText += `\nAddress${addr.label ? ` (${addr.label})` : ''}: ${formattedAddr}`;
            }
          });
        }
        shareText += `\n----------------\n`;
      });
    } else {
      shareText += "No members in this group or its subgroups.\n";
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Group: ${group.name}`,
          text: shareText,
        });
        toast({ title: "Shared", description: "Group details sent to share dialog." });
      } catch (error: any) {
        console.error('Error sharing group:', error);
         if (error.name === 'AbortError') {
             toast({ title: "Share Canceled", description: "Sharing was canceled by the user.", variant: "default" });
        } else {
            toast({ title: "Share Failed", description: "Could not share group. Trying to copy instead...", variant: "default" });
            await copyToClipboard(shareText, `Group: ${group.name}`);
        }
      }
    } else {
      toast({ title: "Web Share API not available", description: "Group details copied to clipboard instead.", variant: "default"});
      await copyToClipboard(shareText, `Group: ${group.name}`);
    }
  };

  const renderGroupItem = (group: GroupWithHierarchy) => (
    <div key={group.id} style={{ marginLeft: `${group.level * 1.25}rem` }} className="my-1.5">
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 group/card">
        <CardContent className="p-3 flex items-center justify-between gap-2">
          <div className="flex items-center flex-grow min-w-0">
            {(group.children && group.children.length > 0) || group.subGroupCount > 0 ? (
               <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); toggleExpand(group.id);}}
                      className="mr-2 h-8 w-8 flex-shrink-0 rounded-md hover:bg-accent/50"
                      aria-expanded={expandedGroups[group.id]}
                      aria-controls={`subgroups-of-${group.id}`}
                    >
                      {expandedGroups[group.id] ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="start" className="max-w-xs bg-popover text-popover-foreground p-2 rounded-md shadow-lg">
                    <p className="font-semibold text-sm mb-1">Contains Subgroups ({group.subGroupCount}):</p>
                     {group.children && group.children.length > 0 ? (
                       <ScrollArea className="h-auto max-h-32">
                         <ul className="list-disc list-inside text-xs space-y-0.5 pl-1">
                          {group.children.slice(0, 10).map(child => ( // Show more if space allows
                            <li key={child.id} className="truncate" title={child.name}>{child.name}</li>
                          ))}
                          {group.children.length > 10 && <li className="italic">...and {group.children.length - 10} more</li>}
                        </ul>
                       </ScrollArea>
                    ) : (
                      <p className="text-xs italic">Expand to see subgroups.</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div className="mr-2 h-8 w-8 flex-shrink-0"></div> 
            )}
            <div className="flex-grow min-w-0">
              <p 
                className="font-semibold text-md text-foreground truncate cursor-pointer group-hover/card:text-primary transition-colors" 
                title={group.name}
                onClick={(e) => { e.stopPropagation(); handleViewContacts(group.id); }}
              >
                {group.name}
              </p>
              {group.description && <p className="text-xs text-muted-foreground truncate mt-0.5" title={group.description}>{group.description}</p>}
              <div className="mt-1 flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs whitespace-nowrap">
                  <Users className="h-3 w-3 mr-1" />
                  {group.memberCount} {group.memberCount === 1 ? 'member' : 'members'}
                </Badge>
                 {group.subGroupCount > 0 && (
                  <Badge variant="outline" className="text-xs whitespace-nowrap">
                    {group.subGroupCount} {group.subGroupCount === 1 ? 'subgroup' : 'subgroups'}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0 flex-wrap justify-end">
             <TooltipProvider delayDuration={150}><Tooltip>
                <TooltipTrigger asChild>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => { e.stopPropagation(); handleViewContacts(group.id); }}
                        className="h-8 w-8 text-primary hover:text-primary/80 rounded-md"
                    > <Eye className="h-4 w-4" /> </Button>
                </TooltipTrigger>
                <TooltipContent><p>View Contacts</p></TooltipContent>
             </Tooltip></TooltipProvider>
             <TooltipProvider delayDuration={150}><Tooltip>
                <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => { e.stopPropagation(); handleShareGroup(group); }}
                      className="h-8 w-8 rounded-md"
                    ><Share2 className="h-4 w-4" /></Button>
                </TooltipTrigger>
                <TooltipContent><p>Share Group</p></TooltipContent>
            </Tooltip></TooltipProvider>
            <TooltipProvider delayDuration={150}><Tooltip>
                <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => { e.stopPropagation(); openModalForNew(group.id); }} 
                      className="h-8 w-8 rounded-md"
                    ><PlusCircle className="h-4 w-4" /></Button>
                </TooltipTrigger>
                <TooltipContent><p>Add Subgroup</p></TooltipContent>
            </Tooltip></TooltipProvider>
            <TooltipProvider delayDuration={150}><Tooltip>
                <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={(e) => { e.stopPropagation(); openModalForEdit(group); }} 
                      className="h-8 w-8 rounded-md"
                    ><Edit2 className="h-4 w-4" /></Button>
                </TooltipTrigger>
                <TooltipContent><p>Edit Group</p></TooltipContent>
            </Tooltip></TooltipProvider>
            <TooltipProvider delayDuration={150}><Tooltip>
                <TooltipTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={(e) => { e.stopPropagation(); confirmDeleteGroup(group);}} 
                      className="h-8 w-8 rounded-md"
                    ><Trash2 className="h-4 w-4" /></Button>
                </TooltipTrigger>
                <TooltipContent><p>Delete Group</p></TooltipContent>
            </Tooltip></TooltipProvider>
          </div>
        </CardContent>
      </Card>
      {expandedGroups[group.id] && group.children && group.children.length > 0 && group.children.map(renderGroupItem)}
    </div>
  );
  

  if (isLoading) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="h-8 w-1/3 bg-muted rounded animate-pulse"></div>
                <div className="h-10 w-36 bg-muted rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-full bg-muted rounded animate-pulse mb-6"></div>
            {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 w-full bg-muted rounded-lg animate-pulse mb-2"></div>
            ))}
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Groups</h1>
        <Button onClick={() => openModalForNew()} className="shadow-md hover:shadow-lg transition-shadow bg-primary text-primary-foreground">
          <PlusCircle className="mr-2 h-5 w-5" /> Create New Group
        </Button>
      </div>
      
      <div className="p-4 bg-card rounded-lg shadow-md">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search groups by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full shadow-inner text-base"
          />
        </div>
      </div>

      {displayedGroupsHierarchy.length > 0 ? (
        <div>
          {displayedGroupsHierarchy.map(renderGroupItem)}
        </div>
      ) : (
        <Card className="text-center py-12 shadow-md">
          <CardHeader>
            <Users className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle className="text-2xl">No Groups Found</CardTitle>
            <CardDescription className="text-md">
              {searchTerm ? "Try a different search term or clear the search." : "Create a group to start organizing your contacts."}
            </CardDescription>
          </CardHeader>
          {searchTerm && (
            <CardContent>
              <Button variant="outline" onClick={() => setSearchTerm('')} className="shadow-sm">Clear Search</Button>
            </CardContent>
          )}
        </Card>
      )}

      {/* Add/Edit Group Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-lg rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{editingGroup ? 'Edit Group' : 'Create New Group'}</DialogTitle>
            <DialogDescription>
              {editingGroup ? `Update the details for "${editingGroup.name}".` : 'Enter details for the new group.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div>
              <Label htmlFor="groupName" className="text-sm font-medium">Group Name*</Label>
              <Input id="groupName" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder="e.g., Close Friends, Savani Parivar" className="shadow-sm mt-1 text-base" disabled={isSubmittingModal}/>
            </div>
            <div>
              <Label htmlFor="groupDescription" className="text-sm font-medium">Description</Label>
              <Textarea id="groupDescription" value={newGroupDescription} onChange={(e) => setNewGroupDescription(e.target.value)} placeholder="e.g., Friends from college, Savani kutumb members" className="shadow-sm mt-1 min-h-[80px] text-base" disabled={isSubmittingModal}/>
            </div>
            <div>
              <Label htmlFor="groupParent" className="text-sm font-medium">Parent Group</Label>
               <select
                id="groupParent"
                value={newGroupParentId || ""}
                onChange={(e) => setNewGroupParentId(e.target.value || undefined)}
                className="w-full p-2.5 border rounded-md shadow-sm bg-background text-foreground border-input focus:ring-ring focus:ring-2 focus:outline-none mt-1 text-base"
                disabled={isSubmittingModal}
              >
                <option value="">None (Top-level group)</option>
                {groups
                  .filter(g => {
                    if (!editingGroup) return true; 
                    if (g.id === editingGroup.id) return false; 
                    const descendantIdsOfEditingGroup = getAllDescendantGroupIds(editingGroup.id, DUMMY_FAMILY_GROUPS);
                    if (descendantIdsOfEditingGroup.includes(g.id)) return false;
                    return true;
                  })
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(group => ( 
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter className="sm:justify-end gap-2 pt-2">
            <Button variant="outline" onClick={closeModal} className="shadow-md" disabled={isSubmittingModal}>Cancel</Button>
            <Button onClick={handleAddOrUpdateGroup} className="shadow-md hover:shadow-lg transition-shadow min-w-[120px]" disabled={isSubmittingModal}>
                {isSubmittingModal && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmittingModal ? 'Saving...' : (editingGroup ? 'Save Changes' : 'Create Group')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
       <Dialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the group "{groupToDelete?.name}"? 
              Subgroups will be re-parented to this group's parent (or become top-level). This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end gap-2 pt-4">
             <Button variant="outline" onClick={() => setIsConfirmDeleteDialogOpen(false)} disabled={isSubmittingModal}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={executeDeleteGroup} disabled={isSubmittingModal} className="min-w-[100px]">
              {isSubmittingModal && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmittingModal ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
