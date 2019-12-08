import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import {
	addListToDropdown,
	createDropdown
} from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import Model from '@ckeditor/ckeditor5-ui/src/model';
import placeholderIcon from './theme/placeholder.svg';

export default class PlaceholderUI extends Plugin {
	init() {
		const editor = this.editor;
		const placeholderNames = editor.config.get( 'placeholderConfig.types' );

		// The "placeholder" dropdown must be registered among the UI components of the editor
		// to be displayed in the toolbar.
		editor.ui.componentFactory.add( 'placeholder', locale => {
			const dropdownView = createDropdown( locale );

			// Populate the list in the dropdown with items.
			addListToDropdown(
				dropdownView,
				getDropdownItemsDefinitions( placeholderNames )
			);

			dropdownView.buttonView.set( {
				label: 'Insert Placeholder',
				icon: placeholderIcon,
				tooltip: true
			} );

			// Execute the command when the dropdown item is clicked (executed).
			this.listenTo( dropdownView, 'execute', evt => {
				editor.execute( 'placeholder', {
					value: evt.source.commandParam
				} );
				editor.editing.view.focus();
			} );

			return dropdownView;
		} );
	}
}

function getDropdownItemsDefinitions( placeholderNames ) {
	const itemDefinitions = new Collection();

	const addtoCollection = ( placeholder, parent ) =>
		Object.keys( placeholder ).forEach( type => {
			const commandParam = parent ? `${ parent }.${ type }` : type;
			if ( typeof placeholder[ type ] === 'string' ) {
				// Add the item definition to the collection.
				return itemDefinitions.add( {
					type: 'button',
					model: new Model( {
						commandParam,
						label: placeholder[ type ],
						withText: true
					} )
				} );
			}
			addtoCollection( placeholder[ type ], commandParam );
		} );

	addtoCollection( placeholderNames );

	return itemDefinitions;
}
