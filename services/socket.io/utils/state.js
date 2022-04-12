// Author: Umar Bin Ayaz

const users = [];

function addUser({ socketID, user }) {
  const obj = {
    socketID,
    user,
  };

  users.push(obj);

  return;
}

function removeUser(socketID) {
  for (let i = 0; i < users.length; i++) {
    let obj = users[i];
    if (obj.socketID == socketID) {
      users.splice(i, 1);
    }
  }

  return;
}

function findUser({ userID, socketID }) {
  for (let i = 0; i < users.length; i++) {
    let obj = users[i];
    if (obj.id == userID || obj.socketID == socketID) {
      return obj.user;
    }
  }

  return;
}

function printUsers() {
  console.log("----------------------------");
  console.log(`THIS IS THE users.length: ${users.length}`);
  console.log();

  for (let i = 0; i < users.length; i++) {
    let obj = users[i];
    console.log(`${i} ->`, obj);
  }

  console.log();
  console.log("----------------------------");

  return;
}

module.exports = {
  users,
  addUser,
  removeUser,
  findUser,
  printUsers,
};
