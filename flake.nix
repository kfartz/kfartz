{
  description = "Development environment with Biome.js, VSCodium, and Bun";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        # VSCodium with Biome extension
        vscodiumWithExtensions = pkgs.vscode-with-extensions.override {
          vscode = pkgs.vscodium;
          vscodeExtensions = with pkgs.vscode-extensions; [
            # Add other extensions here as needed
          ] ++ pkgs.vscode-utils.extensionsFromVscodeMarketplace [
            {
              name = "biome";
              publisher = "biomejs";
              version = "2025.11.271431";
              sha256 = "sha256-TLm2ppAyZoCHNg3RpEFwUr/C04bkI62AK4kNS4R/j2U=";
            }
          ];
        };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            biome
            bun
            vscodiumWithExtensions
          ];

          shellHook = ''
            echo "🚀 Development environment loaded!"
            echo "  - Biome.js: $(biome --version)"
            echo "  - Bun: $(bun --version)"
            echo "  - VSCodium with Biome extension available"
            echo ""
            echo "Run 'codium .' to open VSCodium in current directory"
          '';
        };
      }
    );
}
