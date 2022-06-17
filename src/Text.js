import { useState } from "react";

const Text = () => {
  const testText =
    "Lorem ipsum dolor sit amet. Et galisum impedit est dolorem error id nemo veritatis qui quibusdam incidunt qui corrupti aspernatur aut recusandae reprehenderit aut velit obcaecati. Eos magnam quae qui deserunt praesentium non enim quia.";

  const [message, setMessage] = useState(testText);

  const [selectedText, setSelectedText] = useState("");

  function showSelection() {
    let selObj = window.getSelection();
    setSelectedText(selObj);
  }

  function handleMessageChange(e) {
    setMessage(e.target.value);
    console.log(e.target.value);
  }

  function handleSelectedChange(e) {
    setSelectedText(e.target.value);
    console.log(e.target.value);
  }

  function bold() {
    document.execCommand("bold");
  }

  return (
    <div>
      <textarea
        id="message"
        name="message"
        value={message}
        onChange={handleMessageChange}
      />
      <button onClick={() => showSelection()}>show selection</button>
      <textarea
        id="message"
        name="message"
        value={selectedText}
        onChange={handleSelectedChange}
      />
      <button onClick={() => bold()}>bold</button>
      <div
        className="correction-text"
        contentEditable="true"
        spellCheck="false"
      >
        Lorem ipsum dolor sit amet. Et galisum impedit est dolorem error id nemo
        veritatis qui quibusdam incidunt qui corrupti aspernatur aut recusandae
        reprehenderit aut velit obcaecati. Eos magnam quae qui deserunt
        praesentium non enim quia.
      </div>
    </div>
  );
};

export default Text;
