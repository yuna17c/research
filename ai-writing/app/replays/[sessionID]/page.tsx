import "../../style_main.css";
import { GetServerSideProps } from 'next';
import { query, collection, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Event } from "@/components/log";


async function getDb(sessionID:string) {
  const q = query(collection(db, 'user-input'), where('timestamp', '==', sessionID));
  const snapshot = await getDocs(q)
  var tmpID = ""
  var tmpLogs: Event[] = []
  if (!snapshot.empty) {
    snapshot.forEach(doc => {
      tmpID = doc.id
      tmpLogs = doc.data().logs
    });
  } else {
    console.log("Requested session does not exist.")
  }
  return tmpLogs
}
export default async function SessionReplay( { params }:any) {
  const sessionID = params.sessionID;
  try {
    // const doc = await getDb(sessionID);
    // console.log("doc", doc)
    const dummy_doc = []
  } catch (error) {
    console.error('Error fetching data from Firestore:', error);
  }
  console.log("done:",sessionID)
  return (
    <>
    <main>
      <h2>Replay session {sessionID}</h2>
    </main>
    </>
  )
}
