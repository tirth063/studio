
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DUMMY_FAMILY_GROUPS, DUMMY_CONTACTS } from '@/lib/dummy-data';
import type { Contact, FamilyGroup, LabeledAddress } from '@/types';
import { PlusCircle, Trash2, Sparkles, UserCircle, MapPin, ChevronDown, Languages } from 'lucide-react';
import { SmartSuggestionModal } from './smart-suggestion-modal';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const MAX_ALTERNATIVE_NUMBERS = 5;
const MAX_ADDRESSES = 3;
const NONE_GROUP_VALUE = "__NONE__"; // Special value for the "None" option

const labeledAddressSchema = z.object({
  label: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional().refine(val => !val || /^\d{5}(-\d{4})?$/.test(val) || /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/.test(val), { message: "Invalid ZIP/Postal code format." }),
  country: z.string().optional(),
});

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  phoneNumber: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }),
  email: z.string().email({ message: 'Invalid email address.' }).optional().or(z.literal('')),
  avatarUrl: z.string().optional(), // Accept Data URLs
  alternativeNumbers: z.array(z.object({ value: z.string().min(10, { message: 'Phone number must be at least 10 digits.'}).optional().or(z.literal('')) })).max(MAX_ALTERNATIVE_NUMBERS).optional(),
  groupIds: z.array(z.string()).optional(),
  displayNames: z.object({
    en: z.string().optional(),
    gu: z.string().optional(),
    hi: z.string().optional(),
  }).optional(),
  notes: z.string().max(500, { message: 'Notes cannot exceed 500 characters.' }).optional(),
  addresses: z.array(labeledAddressSchema).max(MAX_ADDRESSES).optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  initialData?: Partial<Contact>;
  onSubmit: (data: ContactFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function ContactForm({ initialData, onSubmit, isSubmitting }: ContactFormProps) {
  const { toast } = useToast();
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [contactNameToSuggest, setContactNameToSuggest] = useState('');
  
  const [existingContactNames, setExistingContactNames] = useState<string[]>([]);
  const [familyGroupNames, setFamilyGroupNames] = useState<string[]>([]);
  const [friendGroupNames, setFriendGroupNames] = useState<string[]>([]);

  useEffect(() => {
    setExistingContactNames(DUMMY_CONTACTS.map(c => c.name));
    const allGroupNames = DUMMY_FAMILY_GROUPS.map(g => g.name);
    // Basic categorization for suggestions, can be refined
    setFamilyGroupNames(allGroupNames.filter(name => 
      name.toLowerCase().includes('family') || 
      name.toLowerCase().includes('parivar') || 
      name.toLowerCase().includes('kutumb') ||
      name.toLowerCase().includes('savani') || // Assuming these are family names
      name.toLowerCase().includes('golakiya') ||
      name.toLowerCase().includes('soni') ||
      name.toLowerCase().includes('parent') || 
      name.toLowerCase().includes('sibling') || 
      name.toLowerCase().includes('cousin')
    ));
    setFriendGroupNames(allGroupNames.filter(name => name.toLowerCase().includes('friend')));
  }, []);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      phoneNumber: initialData?.phoneNumber || '',
      email: initialData?.email || '',
      avatarUrl: initialData?.avatarUrl || '',
      alternativeNumbers: initialData?.alternativeNumbers?.map(num => ({ value: num })).slice(0, MAX_ALTERNATIVE_NUMBERS) || [{ value: '' }],
      groupIds: initialData?.groupIds || [],
      displayNames: {
        en: initialData?.displayNames?.find(dn => dn.lang === 'en')?.name || '',
        gu: initialData?.displayNames?.find(dn => dn.lang === 'gu')?.name || '',
        hi: initialData?.displayNames?.find(dn => dn.lang === 'hi')?.name || '',
      },
      notes: initialData?.notes || '',
      addresses: initialData?.addresses?.length ? initialData.addresses.slice(0, MAX_ADDRESSES) : [{ label: '', street: '', city: '', state: '', zip: '', country: '' }],
    },
  });

  const { fields: altNumFields, append: appendAltNum, remove: removeAltNum } = useFieldArray({
    control: form.control,
    name: 'alternativeNumbers',
  });

  const { fields: addressFields, append: appendAddress, remove: removeAddress } = useFieldArray({
    control: form.control,
    name: 'addresses',
  });

  const watchName = form.watch('name');
  const watchAvatarUrl = form.watch('avatarUrl'); // Watch avatarUrl for preview

  const handleFormSubmit = async (data: ContactFormValues) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: "Failed to save contact. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleOpenSuggestionModal = () => {
    if (watchName) {
      setContactNameToSuggest(watchName);
      setIsSuggestionModalOpen(true);
    } else {
      toast({
        title: "Contact Name Required",
        description: "Please enter a contact name to get suggestions.",
        variant: "default",
      });
    }
  };

  const handleSuggestionAccepted = (suggestedGroupName: string) => {
    const group = DUMMY_FAMILY_GROUPS.find(g => g.name.toLowerCase() === suggestedGroupName.toLowerCase());
    if (group) {
      const currentGroupIds = form.getValues('groupIds') || [];
      if (!currentGroupIds.includes(group.id)) {
        form.setValue('groupIds', [...currentGroupIds, group.id]);
      }
      toast({
        title: "Suggestion Applied",
        description: `${contactNameToSuggest} marked for ${suggestedGroupName} group.`,
        className: "bg-accent text-accent-foreground",
      });
    } else {
       toast({
        title: "Group Not Found",
        description: `Could not find group: ${suggestedGroupName}. Please select manually.`,
        variant: "destructive",
      });
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // Max 1MB
        toast({
          title: "Image Too Large",
          description: "Please select an image smaller than 1MB.",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('avatarUrl', reader.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
            {/* Column 1: Avatar */}
            <div className="md:col-span-1 space-y-6">
              <FormField
                control={form.control}
                name="avatarUrl"
                render={({ field }) => ( // field includes value, onChange, onBlur etc.
                  <FormItem>
                    <FormLabel>Avatar</FormLabel>
                    <div className="mt-1 mb-2 flex flex-col items-center space-y-3">
                      {watchAvatarUrl ? (
                        <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-primary shadow-lg">
                          <Image src={watchAvatarUrl} alt="Avatar Preview" layout="fill" objectFit="cover" data-ai-hint="contact preview" />
                        </div>
                      ) : (
                        <div className="w-36 h-36 rounded-full bg-muted flex items-center justify-center text-muted-foreground border-2 border-dashed border-border shadow-inner">
                          <UserCircle className="w-24 h-24" />
                        </div>
                      )}
                      {watchAvatarUrl && (
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          className="text-destructive hover:text-destructive/80"
                          onClick={() => form.setValue('avatarUrl', '', { shouldValidate: true })}
                          disabled={isSubmitting}
                        >
                          Remove Image
                        </Button>
                      )}
                    </div>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/png, image/jpeg, image/gif, image/webp"
                        onChange={handleAvatarChange}
                        className="shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Max 1MB. PNG, JPG, GIF, WebP.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Column 2: Basic Info & Groups */}
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Full Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Rameshbhai Savani" {...field} className="shadow-sm" disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Phone*</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="e.g., 9825012345" {...field} className="shadow-sm" disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="e.g., user@example.com" {...field} className="shadow-sm" disabled={isSubmitting}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="groupIds"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between mb-1">
                      <FormLabel>Groups</FormLabel>
                       <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleOpenSuggestionModal}
                        className="text-xs text-primary hover:text-primary/80 px-2"
                        disabled={!watchName || isSubmitting}
                      >
                        <Sparkles className="mr-1 h-3.5 w-3.5" /> Suggest Group
                      </Button>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between shadow-sm font-normal" disabled={isSubmitting}>
                          <span>
                            {field.value && field.value.length > 0
                              ? `${field.value.length} group(s) selected`
                              : "Select groups..."}
                          </span>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]" side="bottom" align="start">
                        <DropdownMenuLabel>Assign to Groups</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <ScrollArea className="h-[200px]">
                          {DUMMY_FAMILY_GROUPS.sort((a,b) => a.name.localeCompare(b.name)).map((group: FamilyGroup) => (
                            <DropdownMenuCheckboxItem
                              key={group.id}
                              checked={field.value?.includes(group.id)}
                              onCheckedChange={(isChecked) => {
                                const currentGroupIds = field.value || [];
                                if (isChecked) {
                                  form.setValue('groupIds', [...currentGroupIds, group.id]);
                                } else {
                                  form.setValue('groupIds', currentGroupIds.filter(id => id !== group.id));
                                }
                              }}
                            >
                              {group.name}
                            </DropdownMenuCheckboxItem>
                          ))}
                           {DUMMY_FAMILY_GROUPS.length === 0 && (
                              <div className="px-2 py-1.5 text-sm text-muted-foreground">No groups available. Create groups on the 'Groups' page.</div>
                            )}
                        </ScrollArea>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Alternative Phone Numbers */}
          <div className="space-y-4">
            <FormLabel>Alternative Phone Numbers (Max {MAX_ALTERNATIVE_NUMBERS})</FormLabel>
            {altNumFields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`alternativeNumbers.${index}.value`}
                render={({ field: itemField }) => (
                  <FormItem className="flex items-start sm:items-center gap-2">
                    <FormControl>
                      <Input type="tel" placeholder={`Alternative number ${index + 1}`} {...itemField} className="flex-grow shadow-sm" disabled={isSubmitting} />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAltNum(index)}
                      className="h-9 w-9 text-muted-foreground hover:text-destructive flex-shrink-0 shadow-sm border"
                      disabled={isSubmitting}
                      aria-label="Remove alternative number"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <FormMessage className="mt-0 sm:ml-2" /> 
                  </FormItem>
                )}
              />
            ))}
            {altNumFields.length < MAX_ALTERNATIVE_NUMBERS && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendAltNum({ value: '' })}
                className="mt-2 shadow-sm"
                disabled={isSubmitting}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Number
              </Button>
            )}
          </div>
          
          <Separator />

          {/* Display Names Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Languages className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium text-foreground">Alternative Display Names</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
              <FormField
                control={form.control}
                name="displayNames.en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>English</FormLabel>
                    <FormControl>
                      <Input placeholder="Display name in English" {...field} className="shadow-sm" disabled={isSubmitting}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="displayNames.gu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ગુજરાતી (Gujarati)</FormLabel>
                    <FormControl>
                      <Input placeholder="ગુજરાતીમાં નામ" {...field} className="shadow-sm" disabled={isSubmitting}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="displayNames.hi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>हिन्दी (Hindi)</FormLabel>
                    <FormControl>
                      <Input placeholder="हिंदी में नाम" {...field} className="shadow-sm" disabled={isSubmitting}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />
          
          {/* Notes Section */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea placeholder="Any additional notes about this contact..." {...field} className="shadow-sm min-h-[120px]" disabled={isSubmitting}/>
                </FormControl>
                <FormDescription>Up to 500 characters.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />
          
          {/* Addresses Section */}
          <div className="space-y-6">
             <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium text-foreground">Addresses (Max {MAX_ADDRESSES})</h3>
            </div>
            {addressFields.map((item, index) => (
              <div key={item.id} className="space-y-4 p-4 border rounded-lg shadow-md relative bg-card/50">
                <div className="flex justify-between items-center mb-2">
                    <p className="font-medium text-md text-foreground">Address {index + 1}</p>
                    {addressFields.length > 0 && ( // Show remove button if there's at least one address to remove (don't allow removing the last one if it's the only one and empty)
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            if (addressFields.length === 1 && index === 0) { // If only one address, clear its fields instead of removing
                                form.setValue(`addresses.${index}.label`, '');
                                form.setValue(`addresses.${index}.street`, '');
                                form.setValue(`addresses.${index}.city`, '');
                                form.setValue(`addresses.${index}.state`, '');
                                form.setValue(`addresses.${index}.zip`, '');
                                form.setValue(`addresses.${index}.country`, '');
                            } else {
                                removeAddress(index);
                            }
                        }}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        disabled={isSubmitting}
                        aria-label="Remove address"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                </div>
                <FormField
                  control={form.control}
                  name={`addresses.${index}.label`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Home, Work, Village" {...field} className="shadow-sm" disabled={isSubmitting}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`addresses.${index}.street`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 101 Diamond Chowk" {...field} className="shadow-sm" disabled={isSubmitting}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name={`addresses.${index}.city`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City / Village</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Bhavnagar" {...field} className="shadow-sm" disabled={isSubmitting}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`addresses.${index}.state`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State / Province</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Gujarat" {...field} className="shadow-sm" disabled={isSubmitting}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name={`addresses.${index}.zip`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP / Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 364001" {...field} className="shadow-sm" disabled={isSubmitting}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`addresses.${index}.country`}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., India" {...field} className="shadow-sm" disabled={isSubmitting}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
            {addressFields.length < MAX_ADDRESSES && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendAddress({ label: '', street: '', city: '', state: '', zip: '', country: '' })}
                className="mt-2 shadow-sm"
                disabled={isSubmitting}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Another Address
              </Button>
            )}
          </div>
          
          <Separator />

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => {
                const resetValues = {
                    name: initialData?.name || '',
                    phoneNumber: initialData?.phoneNumber || '',
                    email: initialData?.email || '',
                    avatarUrl: initialData?.avatarUrl || '',
                    alternativeNumbers: initialData?.alternativeNumbers?.map(num => ({ value: num })).slice(0,MAX_ALTERNATIVE_NUMBERS) || [{ value: '' }],
                    groupIds: initialData?.groupIds || [],
                    displayNames: {
                      en: initialData?.displayNames?.find(dn => dn.lang === 'en')?.name || '',
                      gu: initialData?.displayNames?.find(dn => dn.lang === 'gu')?.name || '',
                      hi: initialData?.displayNames?.find(dn => dn.lang === 'hi')?.name || '',
                    },
                    notes: initialData?.notes || '',
                    addresses: initialData?.addresses?.length ? initialData.addresses.slice(0, MAX_ADDRESSES) : [{ label: '', street: '', city: '', state: '', zip: '', country: '' }],
                };
                form.reset(resetValues);
                toast({ title: "Form Reset", description: "All fields have been reset to their initial values.", duration: 3000 });
            }} disabled={isSubmitting} className="shadow-md">
              {initialData?.id ? 'Revert Changes' : 'Clear Form'}
            </Button>
            <Button type="submit" disabled={isSubmitting} className="shadow-md hover:shadow-lg transition-shadow min-w-[120px]">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isSubmitting ? 'Saving...' : (initialData?.id ? 'Update Contact' : 'Create Contact')}
            </Button>
          </div>
        </form>
      </Form>

      <SmartSuggestionModal
        isOpen={isSuggestionModalOpen}
        onOpenChange={setIsSuggestionModalOpen}
        contactName={contactNameToSuggest}
        existingContactNames={existingContactNames}
        familyGroupNames={familyGroupNames}
        friendGroupNames={friendGroupNames}
        onSuggestionAccepted={handleSuggestionAccepted}
      />
    </>
  );
}
