((CKEDITOR) => {
  CKEDITOR.plugins.add('pullquote_button', {
    icons: 'pullquote',

    init: editor => {
      editor.addCommand('insertPullquote', new CKEDITOR.dialogCommand('pullquoteDialog'));

      editor.ui.addButton('Pullquote_button', {
        label: 'Insert Pullquote',
        icon: 'pullquote',
        command: 'insertPullquote',
        toolbar: 'Media, 0'
      });

      if(editor.contextMenu) {
        editor.addMenuGroup('insertPullquoteGroup');
        editor.addMenuItem('insertPullquoteItem', {
          label: 'Edit Pullquote',
          icon: 'pullquote',
          command: 'insertPullquote',
          group: 'insertPullquoteGroup'
        });

        editor.contextMenu.addListener(function(element) {
          if (element.getAscendant('pullquote', true)) {
              return { insertPullquoteItem: CKEDITOR.TRISTATE_OFF };
          }
        });
      }

      // This should really be done somewhere more elevated, since it contains unrelated styles.
      editor.addContentsCss('/profiles/custom/cgov_site/themes/custom/cgov/cgov_common/dist/css/Common.css')
    }
  })

  CKEDITOR.dialog.add('pullquoteDialog', '/profiles/custom/cgov_site/modules/custom/cgov_embed/js/plugins/pullquote_button/dialogs/pullquoteDialog.js' );
})(CKEDITOR)
