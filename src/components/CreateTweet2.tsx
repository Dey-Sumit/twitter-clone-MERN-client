import { useState } from "react";
import { MentionsInput, Mention } from "react-mentions";
// import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import dynamic from "next/dynamic";

const DraftEditor = dynamic(async () => import("react-draft-wysiwyg").then((result) => result.Editor), {
  ssr: false,
});
const DATA = {
  users: [
    {
      id: "1",
      display: "John Doe",
      handle: "@john_doe",
    },
    {
      id: "2",
      display: "Jane Doe",
      handle: "@jane_doe",
    },
    {
      id: "3",
      display: "Joe Bloggs",
      handle: "@joe_bloggs",
    },
  ],
  tags: [
    {
      id: "1",
      display: "#react",
      handle: "#react",
    },
    {
      id: "2",
      display: "#javascript",
      handle: "#javascript",
    },
    {
      id: "3",
      display: "#typescript",
      handle: "#typescript",
    },
  ],
};
/* 
const CreateTweet2 = () => {
  const [text, setText] = useState("abc");

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const renderUserSuggestion = () => {};
  const renderTagSuggestion = () => {};

  return (
    <div className={`border border-gray-100 flex p-2 space-x-4 h-48`}>
      <DraftEditor
        // toolbarHidden
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
      />
    </div>
  );
}; */

const CreateTweet2 = () => {
  const [text, setText] = useState("abc");

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const renderUserSuggestion = () => {};
  const renderTagSuggestion = () => {};

  return (
    <div className={`border border-gray-100 flex p-2 space-x-4 h-48`}>
      <MentionsInput value={text} onChange={handleChange} className="w-full focus:outline-none">
        <Mention
          trigger="@"
          data={DATA.users}
          displayTransform={(id, display) => {
            return `@${display}`;
          }}
          // markup="@__display__"
          appendSpaceOnAdd
          style={{
            backgroundColor: "#272e38",
            color: "blue",
            zIndex: 1,
            position: "relative",
          }}
        />
        <Mention
          trigger="#"
          //   displayTransform={(id, display) => {
          //     console.log(id, display);

          //     return `${display}`;
          //   }}
          markup="[__display__](__id__)"
          data={DATA.tags}
          appendSpaceOnAdd
          style={{
            backgroundColor: "#272e38",
            color: "blue",
            zIndex: 1,
            position: "relative",
          }}
        />
      </MentionsInput>
    </div>
  );
};

export default CreateTweet2;
