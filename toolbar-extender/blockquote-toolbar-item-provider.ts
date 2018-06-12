import { ClassProvider, Injectable } from "@angular/core";
import { ToolBarItem, ToolBarItemsProvider, TOOLBARITEMS_TOKEN } from "progress-sitefinity-adminapp-sdk/app/api/v1";

// This is webpack specific loader syntax for injecting css as <style> tag in header
require("!style-loader!css-loader!./blockquote-toolbar-item-provider.css");

/**
 * A custom toolbar provider implementation for inserting existing videos in the editor.
 * Kendo UI Editor custom tools documentation -> https://demos.telerik.com/kendo-ui/editor/custom-tools
 */
@Injectable()
class BlockquoteToolbarItemProvider implements ToolBarItemsProvider {

    getToolBarItems(editorHost: any): ToolBarItem[] {
        const CUSTOM_TOOLBAR_ITEM: ToolBarItem = {
            name: "Blockquote",
            tooltip: "Quote block",
            ordinal: 6,
            exec: () => {
                const editor = editorHost.getKendoEditor();

                var quoteElement = document.createElement('div');
                quoteElement.setAttribute('data-class','blockquote-container');
                quoteElement.innerHTML = '<blockquote>Quote text</blockquote><div>- Person Name, Author of this quote</div>';

                editor.paste(quoteElement.outerHTML);
                editor.trigger("change");
            }
        };

        return [CUSTOM_TOOLBAR_ITEM];
    }
}

/**
 * Export a 'multi' class provider so that multiple instances of the same provider can coexist.
 * This allows for more than one provider to be registered within one or more bundles.
 */
export const BLOCKQUOTE_TOOLBAR_ITEM_PROVIDER: ClassProvider = {
    multi: true,
    provide: TOOLBARITEMS_TOKEN,
    useClass: BlockquoteToolbarItemProvider
};
