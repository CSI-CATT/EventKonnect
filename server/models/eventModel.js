// server/models/eventModel.js
const admin = require('firebase-admin');
const db = admin.firestore();

const Event = {
  create: async (data) => {
    const docRef = db.collection('events').doc();
    await docRef.set(data);
    return { id: docRef.id, ...data };
  },

  getByAdminId: async (adminId) => {
    const snapshot = await db.collection('events').where('adminId', '==', adminId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  getById: async (id) => {
    const doc = await db.collection('events').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  update: async (id, data) => {
    await db.collection('events').doc(id).update(data);
    return { id, ...data };
  },

  delete: async (id) => {
    await db.collection('events').doc(id).delete();
    return { success: true };
  },
};

module.exports = Event;
