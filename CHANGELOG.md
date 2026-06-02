# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Security
- Bump Pillow to 12.2.0, clearing the open image-parsing advisories (PSD out-of-bounds write, FITS/PDF decompression/DoS, font integer overflow).
- Bump vite to 6.4.3 and vitest to 4.1.8 (esbuild 0.25.12), clearing the dev-server path-traversal and Vitest UI-server advisories. These are dev/test-only tools and are not part of the shipped images.
- Harden `resolveUrl()` to return only a same-origin relative path or an `http(s)` absolute URL (rebuilt via the URL API with an explicit protocol allowlist), and guard the Scope `<img>` src with the same allowlist, making the "no script-bearing scheme reaches an `<img src>`" invariant explicit at both sinks.

### Documentation
- Add an "Updating" section to the README covering how to pull new releases.

## [0.1.3] - 2026-06-02

### Added
- Detection and grounding boxes (and points) now display the detected object's label, parsed from the model's `<ref>` tags. The label falls back to the box index when the model returns none, and long labels are truncated with the full text shown on hover.

### Documentation
- Update the detection screenshot to show the per-box labels.
- Add a detection demo video to the README.
- Use `Move-Item -Force` instead of `Rename-Item` in the Windows (PowerShell) quickstart, so re-running the step overwrites an existing `docker-compose.yml` instead of failing with "Cannot create a file when that file already exists".

## [0.1.2] - 2026-05-28

### Fixed
- Switching GPUs from the System page no longer breaks inference. The model's vision RoPE cache (`freqs_cis`) is a lazily-computed plain attribute pinned to its first device, so `model.to(...)` left it stranded on the old GPU; it is now invalidated on every device switch so it recomputes on the active GPU (previously raised `Expected all tensors to be on the same device, cuda:1 and cuda:0`).

### Changed
- Default the web UI port to **9080** (was 8080) across both compose files, `.env.example`, and `scripts/run.sh`, to avoid colliding with other services commonly on 8080. Override with `FRONTEND_PORT`.
- Bump first-party workflow actions to their Node 24 versions (checkout v6, docker login v4, docker metadata v6) to clear the Node 20 deprecation warnings.

### Documentation
- Make the prebuilt-image quickstart self-contained (open URL, first-run model-load note, GPU check) and correct the `LA_VERSION` example tag (no leading `v`).
- Add Home, Detection, and System screenshots to the README.
- Give the prebuilt quickstart separate Linux/macOS/WSL and Windows (PowerShell) command blocks (`curl.exe` + `Rename-Item`).

## [0.1.1] - 2026-05-27

### Security
- Scoped the CI workflow `GITHUB_TOKEN` to least privilege (`permissions: contents: read`).
- Validate the user-configurable backend URL to `http(s)` only, so a stored value can't reach an `<img src>` as a script-bearing URL.

### Changed
- Bumped Pillow to 11.3.0, the nginx base image to 1.31-alpine, and several CI action versions.
- Hardened Dependabot: ignore major-version bumps, fully pin model-critical deps (transformers, opencv, numpy, lmdb) and CUDA, and group Actions/Docker updates into single PRs.

### Fixed
- Pinned `eslint-plugin-react-refresh` to the 0.4.x line (0.5.x requires eslint 9), restoring `npm ci`.

## [0.1.0] - 2026-05-27

### Added
- Initial project scaffold: repository structure, engineering conventions, CI skeleton, licenses, and documentation.
- FastAPI backend wrapping NVIDIA LocateAnything-3B with all task presets (detection, phrase grounding, text grounding, scene-text detection, GUI grounding, pointing), `fast`/`hybrid`/`slow` decode modes, box/point parsing, and a no-GPU mock mode (`LA_MOCK=1`).
- SQLite-backed search history with image storage and list/get/delete endpoints.
- React + Vite + Tailwind web UI: machine-vision HUD aesthetic, image upload (drag/drop + mobile camera), reticle box/crosshair overlay, search log, mobile-responsive layout, GPU/health readout, and a runtime-configurable backend URL for remote-GPU use.
- Docker Compose deployment with NVIDIA GPU passthrough, model/HF cache volumes, a no-GPU mock override, and a `scripts/check-gpu.sh` preflight check.
- Native support for the full GPU range incl. Blackwell (RTX 50-series, `sm_120`) via a CUDA 12.8 PyTorch build, with a supported-GPU table in the README.
- Non-blocking model load: the server starts immediately and loads the model in the background; `/api/health` reports a `loading` status so the UI shows "loading model…" instead of appearing offline.
- GPU picker: enumerate all visible GPUs and choose which one runs the model from the System page (`GET /api/devices`, `POST /api/device`, `LA_DEVICE` for the startup default), with a VRAM guard, an inference lock, and the active card reflected in the status badge.
- Info tooltips (ⓘ) on each task chip and the decode-mode control, with task descriptions served from the backend.
- Distribution: release workflow builds and pushes backend/frontend images to GHCR on version tags; an end-user `docker-compose.ghcr.yml` runs prebuilt images with no source checkout. The backend port is no longer published by default (frontend-only), with `docker-compose.expose-backend.yml` to opt in, and `scripts/run.sh` auto-selects a free UI port.

[Unreleased]: https://github.com/gammahazard/locate-anything/compare/v0.1.3...HEAD
[0.1.3]: https://github.com/gammahazard/locate-anything/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/gammahazard/locate-anything/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/gammahazard/locate-anything/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/gammahazard/locate-anything/releases/tag/v0.1.0
