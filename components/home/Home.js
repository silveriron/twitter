import React, { useEffect, useState } from "react";
import useInput from "../../hooks/useInput";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../utility/firebase";
import Pweet from "./Pweet";
import Image from "next/image";
import useImageUpload from "../../hooks/useImageUpload";
import pweetSubmit from "../../utility/pweet";

const Home = ({ userObj }) => {
  const [pweet, onChangePweet, setPweet] = useInput();
  const [image, setImage, imageUploadHandler] = useImageUpload();
  const [pweets, setPweets] = useState([]);

  useEffect(() => {
    onSnapshot(collection(db, "pweet"), (snapshot) => {
      const pweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      pweetArray.sort((a, b) => b.createAt - a.createAt);
      setPweets(pweetArray);
    });
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    pweetSubmit(image, pweet, userObj.uid);
    setPweet("");
    setImage(null);
  };

  const onClearImageHandler = () => setImage(null);

  return (
    <>
      {image && (
        <div>
          <Image src={image} alt={image} width="200" height="200" />
          <button onClick={onClearImageHandler}>Clear</button>
        </div>
      )}
      <form onSubmit={onSubmitHandler}>
        <input
          value={pweet}
          placeholder="어떤 생각을 하고 계시나요?"
          type="text"
          onChange={onChangePweet}
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={imageUploadHandler} />
        <input type="submit" value="Pwitter" />
      </form>
      <div>
        {pweets.map((pweet) => {
          return (
            <Pweet
              key={pweet.id}
              pweetObj={pweet}
              isOwner={pweet.creatorId === userObj.uid}
            />
          );
        })}
      </div>
    </>
  );
};

export default Home;
