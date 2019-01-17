CKEDITOR.dialog.add('pullquoteDialog', function(editor) {
  return {
    title: 'Add a pullquote',
    minWidth: 400,
    minHeight: 200,
    contents: [
      {
        id: 'tab-basic',
        label: 'Basic Settings',
        elements: [
          {
            type: 'text',
            id: 'authortext',
            label: 'Author',
            validate: CKEDITOR.dialog.validate.notEmpty('Author Text field can not be empty.'),
            setup: function(element) {
              this.setValue(element.getAttribute('authortext'));
            },
            commit: function(element) {
              const authortext = this.getValue();
              if (authortext) {
                element.setAttribute('authortext', authortext);
              }
              else if (!this.insertMode) {
                element.removeAttribute('authortext');
              }
            }
          },
          {
            type: 'textarea',
            id: 'bodytext',
            label: 'Body',
            validate: CKEDITOR.dialog.validate.notEmpty('Body Text field can not be empty.'),
            setup: function(element) {
              this.setValue(element.getAttribute('bodytext'));
            },
            commit: function(element) {
              const bodytext = this.getValue();
              if (bodytext) {
                element.setAttribute('bodytext', bodytext);
              }
              else if (!this.insertMode) {
                element.removeAttribute('bodytext');
              }
            }
          },
          {
            type: 'radio',
            id: 'alignment',
            label: 'Alignment',
            items: [
              ['Left Aligned', 'left'],
              ['Centered', 'centered'],
              ['Right Aligned', 'right'],
            ],
            default: 'centered',
          }
        ]
      }
    ],

    onShow: function() {
      var selection = editor.getSelection();
      var element = selection.getStartElement();

      if ( element )
          element = element.getAscendant( 'cgov-pullquote', true );

      if ( !element || element.getName() != 'cgov-pullquote' ) {
          element = editor.document.createElement( 'cgov-pullquote' );
          this.insertMode = true;
      }
      else
          this.insertMode = false;

      this.element = element;
      if ( !this.insertMode )
          this.setupContent( this.element );
    },

    onOk: function() {
      const dialog = this;
      const element = this.element;

      const authortext = dialog.getValueOf('tab-basic', 'authortext');
      const bodytext = dialog.getValueOf('tab-basic', 'bodytext');
      const alignment = dialog.getValueOf('tab-basic', 'alignment');
      const containerClass = alignment === 'centered' ? '' : '-' + alignment;

      element.setAttribute('containerClass', containerClass);
      element.setAttribute('bodytext', bodytext);
      element.setAttribute('authortext', authortext);

      this.commitContent(element);
      if (this.insertMode) {
        editor.insertElement(element);
      }
    }
  }
});
