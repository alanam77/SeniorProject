import React from "react";
import { useState } from "react";
import styles from "./styles.module.css";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Grid } from "@mui/material";

const presetTags = [
  "CSCI",
  "ENG",
  "PHYS",
  "PHIL",
  "PSYCH",
  "BMED",
  "Calculator",
  "Electronic",
  "Book",
  "Supplies",
];

const EditForm = () => {
  const [message, setMessage] = useState("");
  const location = useLocation();
  const stateObj = location.state;
  const initName = location.state.name;
  const initPrice = location.state.price;
  const initDescription = location.state.description;
  const initCondition = location.state.condition;
  const initTags = location.state.tags;
  const initImage = location.state.image;
  const itemId = location.state.id;
  const [name, setName] = useState(initName);
  const [price, setPrice] = useState(initPrice);
  const [description, setDescription] = useState(initDescription);
  const [condition, setCondition] = useState(initCondition);
  const [tags, setTags] = useState(initTags);
  const [selectedTag, setSelectedTag] = useState([]);
  const [image, setImage] = useState(initImage);
  const showMessage = () => {
    setMessage('Please select at least one tag');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("condition", condition);
    formData.append("image", image);
    formData.append("tags", tags); // stringify tags array

    const data = {
      name,
      price,
      description,
      condition,
      image,
      tags: tags
    };

    try {
      if (data.tags.length === 0) {
        throw new Error("Please select at least one tag");
      }
      const token = localStorage.getItem("token");
      const response = await axios.put(`http://localhost:8080/api/listings/${itemId}`, data,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      window.location = "/userprofile";
    } catch (error) {
      showMessage();
      console.error(error);
    }
  };

  const handleAddTag = () => {
    if (selectedTag && tags.length < 5 && !tags.includes(selectedTag)) {
      setTags([...tags, selectedTag]);
      setSelectedTag("");
    }
  };

  const handleRemoveTag = (tag) => {
    const updatedTags = tags.filter((t) => t !== tag);
    setTags(updatedTags);
  };

  return (
    <Grid container>
      <div className={styles.listing_container}>
        <div className={styles.form_container}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.form_group}>
              <label htmlFor="name">Name:</label>
              <input
                id="name"
                data-testid="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.form_control}
              />
            </div>
            <div className={styles.form_group}>
              <label htmlFor="price">Price:</label>
              <input
                id="price"
                data-testid="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={styles.form_control}
              />
            </div>
            <div className={styles.form_group}>
              <label htmlFor="desc">Description:</label>
              <textarea
                id="desc"
                data-testid="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.form_control}
              />
            </div>
            <div className={styles.form_group}>
              <label htmlFor="cond">Condition:</label>
              <select
                id="cond"
                data-testid="cond"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className={styles.form_control}
              >
                <option value="">-- Select a condition --</option>
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value="like new">Like new</option>
                <option value="fair">Fair</option>
              </select>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="tags">Tags:</label>
              <div className={styles.tags}>
                <select
                  id="tags"
                  data-testid="tags"
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className={styles.form_control}
                >
                  <option value="">-- Select a tag --</option>
                  {presetTags.map((tagOption) => (
                    <option key={tagOption} value={tagOption}>
                      {tagOption}
                    </option>
                  ))}
                </select>
                <button
                  data-testid="add-btn"
                  type="button"
                  onClick={handleAddTag}
                  className={styles.btn}
                >
                  Add
                </button>
              </div>
              <ul className={styles.tag_list}>
                {tags.map((tag) => (
                  <li key={tag} className={styles.tag_item}>
                    {tag}
                    <button
                      data-testid="remove-btn"
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className={styles.btn_remove}
                    >
                      x
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="image">
                Image:
                <input
                  id="image"
                  data-testid="image"
                  type="text"
                  value={image}
                  onChange={(event) => setImage(event.target.value)}
                  required
                  className={styles.form_control}
                />
              </label>
            </div>
            <div className={styles.form_group}>
              <input
                data-testid="sub-btn"
                type="submit"
                value="Submit"
                className={styles.btn}
              />
              {message && <p className={styles.message}>{message}</p>}
            </div>
          </form>
        </div>
      </div>
    </Grid>
  );
};

export default EditForm;