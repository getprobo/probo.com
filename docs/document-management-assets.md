# Document Management assets

## Included illustrations

The page fills all thirteen illustration placements: one hero, four workflows, seven capability cards, and one shared Product Discovery card. Eleven illustrations use native Figma exports in `public/document-management/figma/`. The signing workflow and Versions card reuse the existing Employee Portal assets. The testimonial reuses the Blaxel team photograph, Paul Sinai quote, and author portrait already used on other product pages.

Only the native web assets are needed for this implementation. Earlier illustration explorations and local export working files are not runtime dependencies.

## Figma sources

- [Workflow and capability illustrations, section 1596:4504](https://www.figma.com/design/yJV3UadcmmJhlquvMSLcAA/_08.26-Product-Page?node-id=1596-4504): three workflow illustrations and six capability cards. Workflows have 1x/2x lossless WebP variants; capability cards have 1x/2x/3x variants.
- [Hero and discovery illustrations, section 1609:3838](https://www.figma.com/design/yJV3UadcmmJhlquvMSLcAA/_08.26-Product-Page?node-id=1609-3838): hero node `1609:3272`, gallery node `1609:3212`, and halo node `1609:2818`.

The current hero includes the 16 October revision with three wider document columns and six visible documents. Its 1080 × 720 browser frame is exported with its shadow on 1146 × 786 and 2292 × 1572 canvases.

The discovery gallery uses 460 × 498 and 920 × 995 variants. It keeps the Figma composition at left 32 / top 162 inside the existing card. The gallery was exported with its full bounds rather than its ancestor-clipped bounds. The source card's unrelated Probo Agent title is not part of the exported artwork; the site uses Document Management copy and navigation.

The signing workflow uses `/employee-portal/workflow-signatures-approvals-ui.svg`. Versions uses `/employee-portal/capability-version-history.webp` and its existing 2x/3x variants. The example company, people, documents, and signature evidence in the illustrations are fictional.

## Validation

- All thirteen illustration placements are filled; no active illustration uses an earlier ImageGen set.
- The page includes seven capability cards and thirteen FAQ entries with matching structured data.
- Desktop, tablet, and mobile checks covered widths of 1440, 768, 390, and 320 pixels without horizontal overflow.
- FAQ click/keyboard controls, mobile navigation, product discovery controls, the documentation link, and reduced-motion behavior were checked in the browser.
- The thirteen unique internal destinations in the main content exist in the production build.
- The production build and asset size check pass.

The shared product hero clipping allows the fluorescent halo to continue behind the header on all seven product pages while retaining the existing lower and horizontal clipping.

## Product confirmations before publication

The source brief still asks for confirmation of cloud email batching/reminder defaults, corresponding notification documentation, and managed-service wording. The local documentation lists 24 MCP tools and 22 n8n Document operations; these counts have not been independently checked against a current cloud release. The existing general Blaxel testimonial and shared social image are intentional reuse of existing site content.

Implementation and visual validation do not confirm those product settings or authorize publication.
