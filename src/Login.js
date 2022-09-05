import React from "react";

export default function Login(props) {
  return (
    // <div className="flex flex-col gap-3 font-poppins">
    //   <div className="flex flex-col gap-3">
    //     <h2>Register</h2>
    //     <label>email</label>
    //     <input
    //       className="border border-sky-300"
    //       onChange={(e) => {
    //         props.setRegEmail(e.target.value);
    //       }}
    //     ></input>
    //     <label>password</label>
    //     <input
    //       className="border border-sky-300"
    //       onChange={(e) => {
    //         props.setRegPass(e.target.value);
    //       }}
    //     ></input>
    //     <button
    //       className="bg-sky-200 py-2 px-4"
    //       onClick={() => props.register()}
    //     >
    //       register
    //     </button>
    //   </div>
    //   <h2>Log in</h2>
    //   <label>email</label>
    //   <input
    //     className="border border-sky-300"
    //     onChange={(e) => {
    //       props.setLoginEmail(e.target.value);
    //     }}
    //   ></input>
    //   <label>password</label>
    //   <input
    //     className="border border-sky-300"
    //     onChange={(e) => {
    //       props.setLoginPass(e.target.value);
    //     }}
    //   ></input>
    //   <button className="bg-sky-200 py-2 px-4" onClick={props.login}>
    //     login
    //   </button>
    //   <button className="bg-sky-200 py-2 px-4" onClick={props.logout}>
    //     log out
    //   </button>
    // </div>
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
