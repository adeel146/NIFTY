import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  ContentState,
  EditorState,
  convertFromHTML,
  convertToRaw,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import { useSelector } from "react-redux";
import { isEmpty } from "lodash";
import { useDispatch } from "react-redux";
import { setNotes } from "redux/reducers/minutesofmeetings";

function NotePad() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [editorText, setEditorTextState] = useState("");
  const dispatch = useDispatch();

  const { selectedmeeting } = useSelector(
    (state) => state.minutesofmeetingSlice
  );

  useEffect(() => {
    if (!isEmpty(selectedmeeting)) {
      setEditorState(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(
            convertFromHTML(selectedmeeting?.notes ?? "")
          )
        )
      );
    }
  }, [selectedmeeting?.id]);

  function onEditorStateChange(_editorState) {
    setEditorState(_editorState);
    const notesText = draftToHtml(
      convertToRaw(_editorState?.getCurrentContent())
    );
    dispatch(setNotes(notesText));
  }

  return (
    <div>
      <Editor
        toolbar={{
          options: ["inline", "list"],
          inline: {
            options: ["bold", "italic", "underline", "strikethrough"],
            bold: {
              // className: "!bg-[#f7d18a] !border-[#f7d18a]",
            },
            italic: {
              // className: "!bg-[#f7d18a] !border-[#f7d18a]",
            },
            underline: {
              // className: "!bg-[#f7d18a] !border-[#f7d18a]",
            },
            strikethrough: {
              // className: "!bg-[#f7d18a] !border-[#f7d18a]",
            },
          },

          list: {
            options: ["unordered"],
            unordered: {
              // className: "!bg-[#f7d18a] !border-[#f7d18a]",
            },
          },
        }}
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
      />
    </div>
  );
}

export default NotePad;
