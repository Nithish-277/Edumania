import React, { Component } from "react";
import { Fragment, useState, useEffect } from "react";

const Dashboard = () => {
  return (
    <div>
      <h1 className="mt-4">Dashboard</h1>
      <p className="lead mb-3">Welcome Here User</p>
      <p className="lead-mb-3">Your Token is . Valid until 7 days</p>
      {/* <a href="/users/logout" class="btn btn-secondary">
        Logout
      </a> */}
    </div>
  );
};

export default Dashboard;
