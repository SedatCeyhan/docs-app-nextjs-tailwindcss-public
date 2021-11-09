import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon";
import { useRouter } from "next/dist/client/router";
import Checkbox from "@material-ui/core/Checkbox";

import { useDispatch } from "react-redux";
import { addToClickedDocs, removeFromClickedDocs } from "../slices/docSlice";
import React, {useState, useEffect} from "react";

import { selectClickedDocs } from "../slices/docSlice";
import { useSelector } from "react-redux";

function DocumentRow({ id, fileName, date }) {
  const router = useRouter();

  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false) 
  const [flag, setFlag] = useState(false);

  const clickedDocs = useSelector(selectClickedDocs);

  useEffect(() => {
    if(checked){
      dispatch(addToClickedDocs({id: id}));
    }
    else if(flag){
      dispatch(removeFromClickedDocs({id: id}))
    }
  }, [checked])

  const handleCheckboxClick = (event) => {
    setChecked(event.target.checked)
    setFlag(true);
  }

  const goToDoc = () => {
    for(let i = clickedDocs.length - 1; i >= 0; --i){
      let docId = clickedDocs[i];
      dispatch(removeFromClickedDocs({id: docId}))
    }
    router.push(`/doc/${id}`);
  }


  return (
    <div className="flex items-center space-x-0">
      <Checkbox onChange={handleCheckboxClick}/>
      <div
        className="flex flex-grow items-center p-4 rounded-lg hover:bg-gray-100 text-gray-700 text-sm cursor-pointer"
        onClick={goToDoc}
      >
        
        <Icon name="article" size="3xl" color="blue" />
        <p className="flex-grow pl-5 w-10 pr-10 truncate">{fileName}</p>
        <p className="pr-5 text-sm">{date?.toDate().toLocaleDateString()}</p>

        <Button
          color="gray"
          buttonType="outline"
          rounded={true}
          iconOnly={true}
          ripple="dark"
          className="border-0"
        >
          <Icon name="more_vert" size="3xl" />
        </Button>
      </div>
    </div>
  );
}

export default DocumentRow;
