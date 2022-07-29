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
    <div className="flex h-screen w-full flex-col">
      <div>
        <h1>THIS IS A DEMO</h1>
      </div>
      <div className="flex h-screen w-full justify-center items-center gap-10">
        {/* <div className="flex flex-col gap-3">
          <h2>Register</h2>
          <label>email</label>
          <input
            className="border border-sky-300"
            onChange={(e) => {
              props.setRegEmail(e.target.value);
            }}
          ></input>
          <label>password</label>
          <input
            className="border border-sky-300"
            onChange={(e) => {
              props.setRegPass(e.target.value);
            }}
          ></input>
          <button
            className="bg-sky-200 py-2 px-4"
            onClick={() => props.register()}
          >
            register
          </button>
        </div> */}
        <div className="flex flex-col gap-3 font-poppins">
          <h2>
            Log in as <b>student</b>
          </h2>
          <button className="bg-sky-200 py-2 px-4" onClick={props.studentLogin}>
            log in
          </button>
        </div>
        <div className="flex flex-col gap-3 font-poppins">
          <h2>
            Log in as <b>teacher</b>
          </h2>
          <button className="bg-sky-200 py-2 px-4" onClick={props.teacherLogin}>
            log in
          </button>
        </div>
      </div>
    </div>
  );
}
