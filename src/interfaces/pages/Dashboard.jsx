import { useState, useEffect } from "react";
import "../styles/Dashboard.css";

function Dashboard({ user, onLogout }) {
  const [selectedOption, setSelectedOption] = useState("Usuarios");
  const [usuarios, setUsuarios] = useState([]);
  const [tandas, setTandas] = useState([]);

  useEffect(() => {
    const userKeys = Object.keys(localStorage).filter((k) => k.startsWith("user_"));
    const usersData = userKeys.map((k) => JSON.parse(localStorage.getItem(k)));
    setUsuarios(usersData);

    const storedTandas = localStorage.getItem("tandas");
    if (storedTandas) {
      setTandas(JSON.parse(storedTandas));
    } else {
      const dummyTandas = [
        {
          id: "t1",
          nombre: "Tanda Dorada",
          numeroActual: 5,
          periodicidad: "Semanal",
          montoFinal: "$10,000",
          usuarios: [],
        },
        {
          id: "t2",
          nombre: "Tanda Express",
          numeroActual: 2,
          periodicidad: "Quincenal",
          montoFinal: "$5,000",
          usuarios: [],
        },
      ];
      setTandas(dummyTandas);
      localStorage.setItem("tandas", JSON.stringify(dummyTandas));
    }
  }, [selectedOption]);

  const handleInputChange = (index, field, value) => {
    const updated = [...usuarios];
    updated[index][field] = value;
    setUsuarios(updated);
  };

  const handleSave = (index) => {
    const u = usuarios[index];
    localStorage.setItem("user_" + u.uid, JSON.stringify(u));
    alert("Usuario actualizado");
  };

  const handleAddUser = () => {
    const newUser = {
      uid: Date.now().toString(),
      nombre: "Nuevo Usuario",
      email: "nuevo@correo.com",
    };
    localStorage.setItem("user_" + newUser.uid, JSON.stringify(newUser));
    setUsuarios((prev) => [...prev, newUser]);
  };

  const handleAddTanda = () => {
    const newTanda = {
      id: "t" + Date.now(),
      nombre: "Nueva Tanda",
      numeroActual: 1,
      periodicidad: "Mensual",
      montoFinal: "$1,000",
      usuarios: [],
    };
    const updated = [...tandas, newTanda];
    setTandas(updated);
    localStorage.setItem("tandas", JSON.stringify(updated));
  };

  const handleUserAssign = (tandaId, userId) => {
    const updated = tandas.map((t) =>
      t.id === tandaId && !t.usuarios.includes(userId)
        ? { ...t, usuarios: [...t.usuarios, userId] }
        : t
    );
    setTandas(updated);
    localStorage.setItem("tandas", JSON.stringify(updated));
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2 className="sidebar-title">TANDAS MX</h2>
        <ul className="menu-options">
          {["Mis tandas", "Usuarios"].map((option) => (
            <li
              key={option}
              onClick={() => setSelectedOption(option)}
              className={selectedOption === option ? "active" : ""}
            >
              {option}
            </li>
          ))}
        </ul>
        <button className="logout-button" onClick={onLogout}>
          Cerrar sesión
        </button>
      </aside>

      <main className="main-content">
        {selectedOption === "Mis tandas" ? (
          <div className="tandas-box">
            <h2>Mis Tandas</h2>
            <button className="dashboard-button" onClick={handleAddTanda}>
              + Agregar Tanda
            </button>
            <table className="tandas-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>No. actual</th>
                  <th>Periodicidad</th>
                  <th>Monto final</th>
                  <th>Usuarios</th>
                  <th>Asignar</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tandas.map((tanda, index) => (
                  <tr key={tanda.id}>
                    <td>{tanda.nombre}</td>
                    <td>{tanda.numeroActual}</td>
                    <td>
                      <input
                        type="text"
                        className="dashboard-input short-input"
                        value={tanda.periodicidad}
                        onChange={(e) => {
                          const updated = [...tandas];
                          updated[index].periodicidad = e.target.value;
                          setTandas(updated);
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="dashboard-input short-input"
                        value={tanda.montoFinal}
                        onChange={(e) => {
                          const updated = [...tandas];
                          updated[index].montoFinal = e.target.value;
                          setTandas(updated);
                        }}
                      />
                    </td>
                    <td>
                      {tanda.usuarios.map((uid) => {
                        const user = usuarios.find((u) => u.uid === uid);
                        return <div key={uid}>{user ? user.nombre : "Desconocido"}</div>;
                      })}
                    </td>
                    <td>
                      <select
                        className="dashboard-input"
                        onChange={(e) => handleUserAssign(tanda.id, e.target.value)}
                        defaultValue=""
                      >
                        <option value="">Seleccionar</option>
                        {usuarios.map((u) => (
                          <option key={u.uid} value={u.uid}>
                            {u.nombre}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        className="dashboard-button"
                        onClick={() => {
                          localStorage.setItem("tandas", JSON.stringify(tandas));
                          alert("Tanda actualizada");
                        }}
                      >
                        Guardar
                      </button>
                      <button
                        className="withdraw-button"
                        onClick={() =>
                          alert("Tus fondos se han transferido a la cuenta ****47")
                        }
                      >
                        Retirar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="usuarios-box">
            <h2>Usuarios Registrados</h2>
            <button className="dashboard-button" onClick={handleAddUser}>
              + Agregar Usuario Ficticio
            </button>
            <table className="usuarios-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u, i) => (
                  <tr key={u.uid}>
                    <td>
                      <input
                        type="text"
                        className="dashboard-input"
                        value={u.nombre}
                        onChange={(e) => handleInputChange(i, "nombre", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        className="dashboard-input"
                        value={u.email}
                        onChange={(e) => handleInputChange(i, "email", e.target.value)}
                      />
                    </td>
                    <td>
                      <button
                        className="dashboard-button"
                        onClick={() => handleSave(i)}
                      >
                        Guardar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;