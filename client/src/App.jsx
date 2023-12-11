import React, { useState, useEffect } from 'react';
import './App.css';
import Axios from 'axios';
function App() {
  const [empname, setEmpname] = useState("");
  const [empjob, setEmpjob] = useState("");
  const [dob, setDob] = useState("");
  const [salary, setSalary] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");
  const [emplist, setEmpList] = useState([]);
  useEffect(() => {
    fetchEmployeeList();
  }, []);

  const fetchEmployeeList = () => {
    Axios.get('http://localhost:3001/api/get').then((response) => {
      // Calculate experience and add it to the result
      const employeesWithExperience = response.data.map((employee) => {
        const currentDate = new Date();
        const joinDate = new Date(employee.date_of_joining);
        const seconds = currentDate - joinDate;
        const experienceInYears = Math.floor(seconds / (365.25 * 24 * 60 * 60 * 1000));
        return {
          ...employee,
          experience: experienceInYears,
        };
      });

      setEmpList(employeesWithExperience);
    });
  };
  const submitReview = () => {
    Axios.post('http://localhost:3001/api/insert', {
      emp_name: empname,
      emp_job: empjob,
      dob: dob,
      salary: salary,
      date_of_joining: dateOfJoining,
    })
      .then(() => {
        fetchEmployeeList();
        setEmpname(prevEmpname => "");
        setEmpjob(prevEmpjob => "");
        setDob(prevDob => "");
        setSalary(prevSalary => "");
        setDateOfJoining(prevDateOfJoining => "");
      });
  };
  const deleteEmp = (emp) => {
    Axios.delete(`http://localhost:3001/api/delete/${emp}`)
      .then(() => {
        fetchEmployeeList();
      });
  };
  return (
    <>
      <h1>Employee Details</h1>
      <div className='form'>
        <label>Enter Employee Name</label>
        <input
          type='text'
          name='EmployeeName'
          onChange={(e) => {
            setEmpname(e.target.value);
          }}
        />
        <label>Enter Job</label>
        <input
          type='text'
          name='Job'
          onChange={(e) => {
            setEmpjob(e.target.value);
          }}
        />
        <label>Enter Date of Birth</label>
        <input
          type='date'
          name='dob'
          value={dob}
          onChange={(e) => {
            setDob(e.target.value);
          }}
        />
        <label>Enter Salary</label>
        <input
          type='text'
          name='Salary'
          onChange={(e) => {
            setSalary(e.target.value);
          }}
        />
        <label>Enter Date of Joining</label>
        <input
          type='date'
          name='dateOfJoining'
          value={dateOfJoining}
          onChange={(e) => {
            setDateOfJoining(e.target.value);
          }}
        />
        <button className='formbutton' onClick={submitReview}>
          Submit
        </button>
        <table className="employee-table">
          <thead>
            <tr>
              <th>S.no</th>
              <th>Employee Name</th>
              <th>Employee Job</th>
              <th>Date of Birth</th>
              <th>Salary</th>
              <th>Date of Joining</th>
              <th>Experience (Years)</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {emplist.map((val, id) => (
              <tr key={id}>
                <td>{id + 1}</td>
                <td>{val.emp_name}</td>
                <td>{val.emp_job}</td>
                <td>{new Date(val.dob).toLocaleDateString('en-GB')}</td>
                <td>{val.salary}</td>
                <td>{new Date(val.date_of_joining).toLocaleDateString('en-GB')}</td>
                <td>{val.experience}</td>
                <td><button onClick={() => { deleteEmp(val.emp_name) }}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
