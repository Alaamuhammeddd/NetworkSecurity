import { useState, useEffect } from "react";
import axios from "axios";

function AcceptRejectRegistration() {
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(
        "http://localhost:4000/admino/new-accounts",

        {
          withCredentials: true, // This ensures cookies are sent with requests
        }
      )
      .then((response) => {
        setAccounts(response.data);
      })
      .catch((error) => {
        // Log the error object
        setError(error);
      });
  }, []);

  const acceptAccount = (user_id) => {
    axios
      .put(`http://localhost:4000/admino/accept-account/${user_id}`, null, {
        withCredentials: true, // This ensures cookies are sent with requests
      })
      .then((response) => {
        console.log(response);
        axios
          .get("http://localhost:4000/admino/new-accounts", {
            withCredentials: true,
          })
          .then((response) => {
            setAccounts(response.data);
          })
          .catch((error) => {
            setError(error);
          });
      })
      .catch((error) => {
        setError(error);
        console.error(error);
      });
  };

  const rejectAccount = (user_id) => {
    const token = localStorage.getItem("token");
    axios
      .put(`http://localhost:4000/admino/reject-account/${user_id}`, null, {
        withCredentials: true, // This ensures cookies are sent with requests
      })
      .then((response) => {
        // Reload the list of accounts
        axios
          .get("http://localhost:4000/admino/new-accounts", {
            withCredentials: true, // This ensures cookies are sent with requests
          })
          .then((response) => {
            setAccounts(response.data);
          })
          .catch((error) => {
            setError(error);
          });
      })
      .catch((error) => {
        setError(error);
      });
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      <div>
        <h1>New Accounts</h1>
        {accounts.length === 0 ? (
          <div>No new accounts</div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid black",
            }}
          >
            <thead>
              <tr style={{ background: "lightgrey" }}>
                <th style={{ border: "1px solid black", padding: "10px" }}>
                  User Name
                </th>
                <th style={{ border: "1px solid black", padding: "10px" }}>
                  Email
                </th>
                <th style={{ border: "1px solid black", padding: "10px" }}>
                  Accept
                </th>
                <th style={{ border: "1px solid black", padding: "10px" }}>
                  Reject
                </th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.user_id}>
                  <td style={{ border: "1px solid black", padding: "10px" }}>
                    {account.user_name}
                  </td>
                  <td style={{ border: "1px solid black", padding: "10px" }}>
                    {account.email}
                  </td>
                  <td style={{ border: "1px solid black", padding: "10px" }}>
                    <button
                      className="btn btn-success"
                      onClick={() => acceptAccount(account.user_id)}
                    >
                      Accept
                    </button>
                  </td>
                  <td style={{ border: "1px solid black", padding: "10px" }}>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => rejectAccount(account.user_id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}

export default AcceptRejectRegistration;
