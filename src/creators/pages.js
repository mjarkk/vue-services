/**
 * @typedef {import('../services/error').ErrorService} ErrorService
 * @typedef {import('../services/translator').TranslatorService} TranslatorService
 * @typedef {import('../services/event').EventService} EventService
 * @typedef {import('../services/router').RouterService} RouterService
 * @typedef {import('vue').CreateElement} CreateElement
 * @typedef {import('vue').VNode} VNode
 * @typedef {import('vue').Component} Component
 */

export class PageCreator {
    /**
     * @param {ErrorService} errorService
     * @param {TranslatorService} translatorService
     * @param {EventService} eventService
     * @param {RouterService} routerService
     */
    constructor(errorService, translatorService, eventService, routerService) {
        /** @type {CreateElement} */
        this._h;
        this._errorService = errorService;
        this._translatorService = translatorService;
        this._eventService = eventService;
        this._routerService = routerService;
    }

    /**
     * @param {CreateElement} h
     */
    init(h) {
        this._h = h;
    }

    createPage(form, modelFactory, subject, createAction, title) {
        // define pageCreator here, cause this context get's lost in the return object
        const pageCreator = this;

        return {
            name: `create-${subject}`,
            data: () => ({editable: modelFactory()}),
            render(h) {
                const titleElement = title
                    ? pageCreator.createTitle(h, title)
                    : pageCreator.createCreatePageTitle(h, subject);

                return pageCreator.createContainer(h, [
                    titleElement,
                    pageCreator.createForm(h, form, this.editable, createAction),
                ]);
            },
            mounted() {
                pageCreator.checkQuery(this.editable);
            },
        };
    }

    editPage(form, getter, subject, updateAction, destroyAction, showAction) {
        // define pageCreator here, cause this context get's lost in the return object
        const pageCreator = this;

        let editable;
        return {
            name: `edit-${subject}`,
            computed: {
                item() {
                    const item = getter();
                    if (item) editable = JSON.parse(JSON.stringify(item));
                    return item;
                },
            },
            render(h) {
                if (!this.item) return;

                return pageCreator.createContainer(h, [
                    pageCreator.createEditPageTitle(h, this.item),
                    pageCreator.createForm(h, form, editable, updateAction),
                    // TODO :: move to method, when there are more b-links
                    // h(
                    //     'b-link',
                    //     {
                    //         class: 'text-danger',
                    //         on: {click: destroyAction},
                    //     },
                    //     [`${pageCreator._translatorService.getCapitalizedSingular(subject)} verwijderen`]
                    // ),
                ]);
            },
            mounted() {
                pageCreator.checkQuery(editable);
                if (showAction) showAction();
            },
        };
    }

    /**
     * @param {CreateElement} h
     * @param {VNode[]} children
     */
    createContainer(h, children) {
        // TODO :: vue3, use create element
        return h('div', {class: 'ml-0 container'}, children);
    }
    /**
     * @param {CreateElement} h
     * @param {VNode[]} children
     */
    createRow(h, children) {
        return h('div', {class: 'row'}, children);
    }
    /**
     * @param {CreateElement} h
     * @param {VNode[]} children
     */
    createCol(h, children) {
        return h('div', {class: 'col'}, children);
    }

    /**
     * @param {CreateElement} h
     * @param {String} title
     */
    createTitle(h, title) {
        // TODO :: vue3, use create element
        return this.createRow(h, [this.createCol(h, [h('h1', [title])])]);
    }

    /**
     * @param {CreateElement} h
     * @param {String} subject
     */
    createCreatePageTitle(h, subject) {
        // TODO :: vue3, use create element
        return this.createTitle(h, this._translatorService.getCapitalizedSingular(subject) + ` toevoegen`);
    }

    /**
     * @param {CreateElement} h
     * @param {Object<string,any>} item
     */
    createEditPageTitle(h, item) {
        // TODO :: vue3, use create element
        // TODO :: it's not always name!
        let name = item.name || item.title;
        if (item.firstname) {
            name = `${item.firstname} ${item.lastname}`;
        }
        return this.createTitle(h, name + ' aanpassen');
    }

    /**
     * @param {CreateElement} h
     * @param {Component} form
     * @param {Object<string,any>} editable
     * @param {(item:Object<string,any) => void} action
     */
    createForm(h, form, editable, action) {
        // TODO :: vue3, use create element
        return h('div', {class: 'row mt-3'}, [
            this.createCol(h, [
                h(form, {
                    props: {
                        editable,
                        errors: this._errorService.getErrors(),
                    },
                    on: {submit: () => action(editable)},
                }),
            ]),
        ]);
    }

    /**
     * @param {Object<string,any>} editable
     */
    checkQuery(editable) {
        const query = this._routerService._router.currentRoute.query;

        if (!Object.keys(query).length) return;

        for (const key in query) {
            if (editable.hasOwnProperty(key)) {
                editable[key] = query[key];
            }
        }
    }
}
