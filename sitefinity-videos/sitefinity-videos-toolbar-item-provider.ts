import { Injectable, ClassProvider, Inject } from "@angular/core";
import { ToolBarItem, ToolBarItemsProvider, TOOLBARITEMS_TOKEN, SelectorService, SelectorOptions, SELECTOR_SERVICE } from "progress-sitefinity-adminapp-sdk/app/api/v1";

require("./sf-video-toolbar.css");

const TRAILING_BREAK = "<br class='k-br'>";

export const ensureTrailingBreaks = (html: string): string => {
    return `${TRAILING_BREAK}${html}${TRAILING_BREAK}`;
};

@Injectable()
class VideosToolbarItemProvider implements ToolBarItemsProvider {
    constructor(@Inject(SELECTOR_SERVICE) private readonly selectorService: SelectorService) { }

    getToolBarItems(editorHost: any): ToolBarItem[] {
        const CUSTOM_TOOLBAR_ITEM: ToolBarItem = {
            name: "Sitefinity-videos",
            tooltip: "Sitefinity videos",
            ordinal: 6,
            exec: () => {
                const editor = editorHost.getKendoEditor();

                // Save editor's current range, so we can insert
                // later the HTML at this position.
                const currentRange = editor.getRange();
                const selectorOptions: SelectorOptions = {
                    multiple: true
                };

                this.selectorService.openVideoLibrarySelector(selectorOptions).subscribe(videos => {
                    if (videos.length) {
                        // Restore editor's saved position.
                        editor.selectRange(currentRange);
                        videos.forEach(video => {
                            const videoElement = document.createElement("video");

                            // Disable video playing, but show controls,
                            // so the video can be playable on the frontend.
                            videoElement.contentEditable = "false";
                            videoElement.src = video.url;
                            videoElement.setAttribute("controls", "true");

                            // Insert the HTML and trigger editor's change, so the
                            // HTML can be saved.
                            editor.paste(ensureTrailingBreaks(videoElement.outerHTML));
                            editor.trigger("change");
                        });
                    }
                });
            }
        };

        return [CUSTOM_TOOLBAR_ITEM];
    }
}

/**
 * The provider registration for Angular's DI
 */
export const VIDEO_TOOLBAR_ITEM_PROVIDER: ClassProvider = {
    multi: true,
    provide: TOOLBARITEMS_TOKEN,
    useClass: VideosToolbarItemProvider
};
