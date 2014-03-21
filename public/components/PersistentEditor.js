/** @jsx React.DOM */

var PersistentEditor = React.createClass({

    retrieveData: function() {
        var editor = this.editor;
        $.get("/retrieveData")
            .done(function(data) {
                editor.setValue(data);
            });
    },

    componentDidMount: function() {
        var editor = ace.edit("editor");
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/javascript");
        editor.on("change", this.handleChange);

        this.editor = editor;
        this.isDelayedSaveStarted = false;

        this.retrieveData();
    },

    handleChange: function() {
        if (!this.isDelayedSaveStarted) {
            this.isDelayedSaveStarted = true;
            setTimeout(this.sendData, this.props.autoSaveInterval);
        }
    },

    sendData: function() {
        this.isDelayedSaveStarted = false;
        $.ajax({
            url: '/sendData',
            dataType: 'json',
            contentType : 'application/json',
            type: 'POST',
            data: JSON.stringify({
                text: this.editor.getValue()
            })
        });
    },

    render: function() {
        return (
            <div id="editor"></div>
        );
    }
});
