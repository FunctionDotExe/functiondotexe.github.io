# Portfolio media

Added September 11, 2026. The user reviewed the local preview and authorized publication to the existing rubenm.me GitHub Pages site.

The Next.js app is the production source (see `.github/workflows/pages.yml`). The legacy root HTML files are not the current site entry point.

## User-supplied media

- `vex-robot.webp`, `vex-detail.webp`: supplied VEX workbench photos.
- `hollow-knight-print.webp`, `warrior-print.webp`: supplied photographs of prints. These are prints of third-party models, not original model designs by Ruben.
- `descent-battle-supplied.webp`: supplied screenshot from Ruben's Descent game.
- `vex-demo.mp4`: the supplied `PXL_20250410_185646744.mp4` (4-second robot test). On September 13, 2026, its audio track was removed at the user's request. The video stream was copied without re-encoding and its SHA-256 matched the original. The published MP4 contains only a video track; versioned player/direct links refresh cached copies. The original download remains unchanged.
- `vex-video-poster.webp`: frame at roughly one second from the supplied video, captured in the browser and cropped to remove playback controls.

Photos were resized without enlargement and converted to WebP. No generative edits.

## Captured project screens

The user-provided YouTube video https://www.youtube.com/watch?v=M2nENtAZZjE belongs to **Arduino Dancing Robot**, separate from the VEX build. The existing Arduino photo opens the video directly on YouTube; the direct destination was verified in the browser. The embedded YouTube player stayed blank in the local browser, so the final implementation uses a reliable external video link.

- `descent-deck.webp`: opening deck selection, captured from https://rubenm.me/descent/ after entering a run setup.
- `descent-title.webp`: actual title screen, cropped to the game surface.
- `read-the-room.webp`: public landing page of https://rubenm.me/ReadTheRoom/. The game requires a password. No password was guessed or bypassed. LinkedIn redirected to a sign-in wall, so no LinkedIn photos were included.

## Saved notebook outputs

Original saved PNG outputs were extracted from downloaded notebooks without executing their code, then converted to WebP. These are experiments, not evidence of clinical performance.

- `notebook-quantum.webp`: cell 6, output 2, [Revised_Qiskit_Kspace_Processing](https://colab.research.google.com/drive/1H-MVU9eA7-yUvf8jxHFMoIZ2QA960xUn?usp=sharing).
- `notebook-plotting.webp`: cell 0, output 0, [Visualization With Data Science II](https://colab.research.google.com/drive/1eTbkqPtoE0gpiHixxdnbqde5Z3_2cOw5?usp=sharing).
- `notebook-mri.webp`: cell 6, output 2, [Kspace_Reconstruction_V14](https://colab.research.google.com/drive/1tXm4A8NJ5Rpyhm3MIthAiAy8hLaLVDfS?usp=sharing). The reconstruction shown is nearly blank; no performance claim is made.

## Model credits

- The Knight: [crashdebug, Thingiverse 3116832](https://www.thingiverse.com/thing:3116832), [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Character by Team Cherry. Creator and license verified on the model page, with a matching model reference image.
- Warrior: user confirms Thingiverse as source. Exact listing and creator could not be verified. Add the exact listing when available.

At the user's request, the individual print labels and captions were replaced by the shared visible caption: "some things i like printing on my free time :)". Source research is retained here for reference.

## Design and checks

The additions inherit the existing dark brown background, cream Cormorant headings, gold links, fine borders, and responsive layout. Images open in a native dialog with keyboard navigation, Escape dismissal, and focus return. Videos load on request; stills use lazy loading. No new dependencies.

Verified the desktop layout, the page inside a 390-pixel phone-width frame (single column, no horizontal overflow), gallery navigation and dismissal, and the print image dialog. TypeScript and the production static export pass; all referenced local media exists.

For local preview, run the existing development script. If the pnpm shim is unavailable, `node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 3000` uses the installed runtime directly.
