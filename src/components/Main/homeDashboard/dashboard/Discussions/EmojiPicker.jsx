import React, { useState } from "react";
import Picker from "@emoji-mart/react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

const EmojiPicker = ({ setMessage, setShowPicker, showPicker }) => {
  const [selectedEmoji, setSelectedEmoji] = useState(null);

  const handleEmojiClick = (emoji) => {
    setSelectedEmoji(emoji.native);
    setShowPicker(false);
    setMessage((prevMessage) => prevMessage + emoji.native);
  };
  return (
    <div className="absolute right-0 bottom-0">
       <div
        className="emoji-icon absolute right-[45px] bottom-[6px]"
        onClick={(e) => {
          e.stopPropagation();
          setShowPicker(!showPicker);
        }}
        style={{ cursor: "pointer" }}
      >
        {!showPicker && (
          <>
            {selectedEmoji ? (
              selectedEmoji
            ) : (
              <EmojiEmotionsIcon
                sx={{
                  fontSize: "18px",
                  color: "#9198CD",
                  display: showPicker ? "none" : "block",
                }}
              />
            )}
          </>
        )}
      </div>
      {showPicker && (
        <Picker
          theme={"light"}
          dynamicWidth={false}
          style={{ height: "200px", overflowY: "scroll" }}
          onEmojiSelect={handleEmojiClick}
        />
      )}
    </div>
  );
};

export default EmojiPicker;
