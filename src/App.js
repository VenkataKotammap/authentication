import React, { useState, useRef } from 'react';
import Data from './data.json';
import './index.css';

const validateValues = (inputValues) => {
  let errors = {};
  if (inputValues.name.length < 3) {
    errors.name = "Name is too short";
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(inputValues.email)) {
    errors.email = "Invalid email";
  }
  if (inputValues.phone.length !== 10) {
    errors.phone = "Phone number should be 10 digits";
  }
  return errors;
};

function App() {
  const [data, setData] = useState(Data);
  const [id, setId] = useState(4); // Starting id after the existing data
  const [editState, setEditState] = useState(-1);
  const [editValues, setEditValues] = useState({ id: '', name: '', email: '', phone: '' });
  const [editErrors, setEditErrors] = useState({});

  function handleEdit(id) {
    const itemToEdit = data.find(item => item.id === id);
    setEditValues(itemToEdit);
    setEditState(id);
  }

  function handleUpdate(event) {
    event.preventDefault();
    const errors = validateValues(editValues);
    if (Object.keys(errors).length === 0) {
      setData(data.map(item => (item.id === editState ? editValues : item)));
      setEditState(-1);
    } else {
      setEditErrors(errors);
    }
  }

  function handleDelete(id) {
    setData(data.filter(item => item.id !== id));
  }

  return (
    <>
      <Add setData={setData} id={id} setId={setId} />
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map(current =>
            editState === current.id ? (
              <Edit
                key={current.id}
                editValues={editValues}
                setEditValues={setEditValues}
                handleUpdate={handleUpdate}
                editErrors={editErrors}
              />
            ) : (
              <tr key={current.id}>
                <td>{current.id}</td>
                <td>{current.name}</td>
                <td>{current.email}</td>
                <td>{current.phone}</td>
                <td>
                  <button className="edit" onClick={() => handleEdit(current.id)}>Edit</button>
                  <button className="delete" onClick={() => handleDelete(current.id)}>Delete</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </>
  );
}

function Edit({ editValues, setEditValues, handleUpdate, editErrors }) {
  return (
    <tr>
      <td>{editValues.id}</td>
      <td>
        <input
          type="text"
          name="name"
          value={editValues.name}
          onChange={e => setEditValues({ ...editValues, name: e.target.value })}
          placeholder="Enter name"
        />
        {editErrors.name && <span className="error">{editErrors.name}</span>}
      </td>
      <td>
        <input
          type="text"
          name="email"
          value={editValues.email}
          onChange={e => setEditValues({ ...editValues, email: e.target.value })}
          placeholder="Enter email"
        />
        {editErrors.email && <span className="error">{editErrors.email}</span>}
      </td>
      <td>
        <input
          type="text"
          name="phone"
          value={editValues.phone}
          onChange={e => setEditValues({ ...editValues, phone: e.target.value })}
          placeholder="Enter phone no"
        />
        {editErrors.phone && <span className="error">{editErrors.phone}</span>}
      </td>
      <td>
        <button onClick={handleUpdate} type="submit">Update</button>
      </td>
    </tr>
  );
}

function Add({ setData, id, setId }) {
  const [values, setValues] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});

  function addValues(event) {
    event.preventDefault();
    const errors = validateValues(values);
    if (Object.keys(errors).length === 0) {
      const addNew = {
        id,
        name: values.name,
        email: values.email,
        phone: values.phone,
      };
      setData(prevData => [...prevData, addNew]);
      setId(prevId => prevId + 1); // Increment the id state
      setValues({ name: '', email: '', phone: '' });
      setErrors({});
    } else {
      setErrors(errors);
    }
  }

  return (
    <>
      <form className="add" onSubmit={addValues}>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={e => setValues({ ...values, name: e.target.value })}
          placeholder="Enter name"
        />
        {errors.name && <span className="error">{errors.name}</span>}
        <input
          type="text"
          name="email"
          value={values.email}
          onChange={e => setValues({ ...values, email: e.target.value })}
          placeholder="Enter email"
        />
        {errors.email && <span className="error">{errors.email}</span>}
        <input
          type="text"
          name="phone"
          value={values.phone}
          onChange={e => setValues({ ...values, phone: e.target.value })}
          placeholder="Enter phone no"
        />
        {errors.phone && <span className="error">{errors.phone}</span>}
        <button>Add</button>
      </form>
    </>
  );
}

export default App;
