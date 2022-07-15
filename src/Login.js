import React from "react";

export default function Login(props) {

  return (
    <div className="flex flex-col gap-3 font-poppins">
      <div className="flex flex-col gap-3">
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
      </div>
      <h2>Log in</h2>
      <label>email</label>
      <input
        className="border border-sky-300"
        onChange={(e) => {
          props.setLoginEmail(e.target.value);
        }}
      ></input>
      <label>password</label>
      <input
        className="border border-sky-300"
        onChange={(e) => {
          props.setLoginPass(e.target.value);
        }}
      ></input>
      <button className="bg-sky-200 py-2 px-4" onClick={props.login}>
        login
      </button>
      <button className="bg-sky-200 py-2 px-4" onClick={props.logout}>
        log out
      </button>
    </div>
  );
}
