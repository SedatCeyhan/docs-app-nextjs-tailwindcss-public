import { useState, useEffect } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Icon from "@material-tailwind/react/Icon";
import Button from "@material-tailwind/react/Button";
import Image from "next/image";
import DocumentRow from "../components/DocumentRow";
import Modal from "@material-tailwind/react/Modal";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import { db } from "../firebase";
import firebase from "firebase";
import { useRouter } from "next/dist/client/router";
import {
  useCollection,
  useCollectionOnce,
} from "react-firebase-hooks/firestore";
import { getSession, useSession } from "next-auth/client";
import Login from "../components/Login";

import DeleteIcon from '@material-ui/icons/Delete';
import { selectClickedDocs } from "../slices/docSlice";
import { useSelector } from "react-redux";

import { useDispatch } from "react-redux";
import { removeFromClickedDocs } from "../slices/docSlice";

export default function Home() {
  const [session, loading] = useSession();
  if (!session) return <Login />;

  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState("");
  const router = useRouter();

  const clickedDocs = useSelector(selectClickedDocs);
  const dispatch = useDispatch();
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    db.collection("userDocs")
      .doc(session.user.email)
      .collection("docs")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setDocuments(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
  }, []);

  const createDocument = () => {
    if (!input) return;

    db.collection("userDocs")
      .doc(session.user.email)
      .collection("docs")
      .add({
        fileName: input,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((doc) => 
      {
        for(let i = clickedDocs.length - 1; i >= 0; --i){
          let docId = clickedDocs[i];
          dispatch(removeFromClickedDocs({id: docId}))
        }
        router.push(`/doc/${doc.id}`)
      });

    setInput("");
    setShowModal(false);
  };

  const deleteClickedDocs = () => {
    for(let i = clickedDocs.length - 1; i >= 0; --i){
      let docId = clickedDocs[i];
      db.collection("userDocs").doc(session.user.email).collection("docs")?.doc(docId).delete();
      dispatch(removeFromClickedDocs({id: docId}))
    }
  }


  const modal = (
    <Modal size="sm" active={showModal} toggler={() => setShowModal(false)}>
      <ModalBody>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          className="outline-none w-full"
          placeholder="Enter name of document..."
          onKeyDown={(e) => e.key === "Enter" && createDocument()}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          color="blue"
          buttonType="link"
          onClick={(e) => setShowModal(false)}
          ripple="dark"
        >
          Cancel
        </Button>

        <Button color="blue" onClick={createDocument} ripple="light">
          Create
        </Button>
      </ModalFooter>
    </Modal>
  );

  return (
    <div className="w-full h-screen">
      <Head>
        <title>Docs App - Sedat Ceyhan</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      {modal}

      <section className="bg-[#F8F9FA] pb-10 px-10 md:px-0">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between py-6">
            <h2 className="text-gray-700 text-lg">Start a new document</h2>

            <Button
              color="gray"
              buttonType="outline"
              iconOnly={true}
              ripple="dark"
              className="border-0"
            >
              <Icon name="more_vert" size="3xl" />
            </Button>
          </div>
          <div>
            <div
              className="relative h-52 w-40 border-2 cursor-pointer hover:border-blue-400 flex justify-center bg-white"
              onClick={(e) => setShowModal(true)}
            >
              <Image src="https://raw.githubusercontent.com/SedatCeyhan/LogoStorage/9872b4dd554d185da3140b79cfe31466635a87f7/plus-3.svg" 
                    // layout="fill" 
                    width={60}
                    height={60}/>
            </div>
            <p className="ml-2 mt-2 font-semibold text-sm text-gray-700">
              Blank
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-10 md:px-0">
        <div className="max-w-3xl mx-auto py-8 text-sm text-gray-700">
          <div className="flex items-center justify-between pb-5">
            <div className="flex flex-grow items-center space-x-3">
              <h2 className="font-medium">My Documents</h2>
              {clickedDocs.length > 0 && (
                <DeleteIcon onClick={deleteClickedDocs} className="cursor-pointer text-red-400"/>
              )}
            </div>
            <p className="mr-12">Date Created</p>
            <Icon name="folder" size="3xl" color="gray" />
          </div>

          {documents.map((doc) => (
            <DocumentRow
              key={doc.id}
              id={doc.id}
              fileName={doc.data.fileName}
              date={doc.data.timestamp}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
