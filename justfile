# Basic Build Tools - Task Runner

# Install all dependencies
install:
    pnpm install

# Build all sub-projects
build-all:
    pnpm -r build

# Dev servers
dev-vite:
    pnpm --filter vite-basic-build dev

dev-parcel:
    pnpm --filter parcel-basic-build dev

dev-turbo:
    pnpm --filter turbo-basic-build dev

dev-webpack:
    pnpm --filter webpack-basic-build dev

dev-esbuild:
    pnpm --filter esbuild-basic-build dev

# Run benchmarks (requires hyperfine)
benchmark:
    bun run ./scripts/benchmark.ts

# Generate CI lockfiles for matrix testing
generate-lockfiles:
    bun run ./scripts/generate-lockfiles.ts

# Clean all build artifacts
clean:
    rm -rf vite/dist parcel/dist turbo/dist webpack/dist esbuild/dist
    rm -rf parcel/.parcel-cache
