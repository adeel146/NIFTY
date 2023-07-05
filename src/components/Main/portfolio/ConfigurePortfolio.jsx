import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Radio,
  Badge,
} from "@mui/material";
const ConfigurePortfolio = ({ questions, setSelectedQuestions }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleAnswerChange = (id, value) => {
    // const value = event.target.value === "yes" ? true : false;
    const updatedQuestions = questions.map((el) => {
      if (el.id === id) {
        return { ...el, isChecked: value };
      }
      return el;
    });
    setSelectedQuestions(updatedQuestions);
  };
  return (
    <div className="mt-[2rem]">
      <List>
        {questions.map((question) => (
          <ListItem key={question.id}>
            <ListItemText primary={question.question} />
            <ListItemSecondaryAction>
              {/* Render a Radio button */}
              <label className="relative inline-flex items-center cursor-pointer mt-2">
                <input
                  type="radio"
                  // value={question.isChecked ? "no" : "yes"}

                  className="sr-only peer"
                  onClick={(e) =>
                    handleAnswerChange(question.id, !question.isChecked)
                  }
                  checked={question.isChecked}
                />
                <div className="w-[60px] h-7 bg-[#e5e8ef] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-gray-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-[28px] after:transition-all peer-checked:bg-[#009084]"></div>
              </label>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ConfigurePortfolio;
