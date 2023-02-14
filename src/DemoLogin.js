import React from "react";

export default function DemoLogin(props) {
  return (
    <div className="flex h-screen w-full flex-col justify-center items-center font-poppins">
      <div className="flex flex-col justify-center items-center gap-10 w-[80%]">
        <h1 className="text-2xl">Messenger Demo</h1>
        <p>
          This project supports two types of users, teachers and students. The
          functionality for each user type differs, as does the display. While
          the teacher’s console/ messenger is responsive, it is designed for
          desktop use. The student messenger has been designed for both desktop
          and mobile.
        </p>
        <p>
          The messenger is fully functional, meaning messages and audio uploads
          will persist until deleted on the back-end. However, please feel free
          to play around as much as you like! All messages are regularly
          cleared.
        </p>
        <p>View as:</p>
      </div>
      <div className="flex w-full justify-center items-center gap-10 mt-10">
        <div className="flex flex-col gap-3 font-poppins">
          <button className="bg-sky-200 py-2 px-4" onClick={props.studentLogin}>
            student
          </button>
        </div>
        <div className="flex flex-col gap-3 font-poppins">
          <button className="bg-sky-200 py-2 px-4" onClick={props.teacherLogin}>
            teacher
          </button>
        </div>
      </div>
    </div>
  );
}
