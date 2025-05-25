{ pkgs, ... }: {
  channel = "stable-24.11"; # Use a supported channel, e.g., "stable-24.05" or "stable-24.11"
  packages = [
    pkgs.nodejs_20
    pkgs.zulu
    pkgs.docker
  ];
  env = { };
  services = {
    docker.enable = true;
    firebase.emulators = {
      detect = true;
      projectId = "demo-app";
      services = [ "auth" "firestore" ];
    };
  };
  idx = {
    extensions = [
      # "vscodevim.vim"
    ];
    workspace = {
      onCreate = {
        default.openFiles = [
          "src/app/page.tsx"
        ];
      };
    };
    previews = {
      enable = true;
      previews = {
        web = {
          command = [ "npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0" ];
          manager = "web";
        };
      };
    };
  };
}
