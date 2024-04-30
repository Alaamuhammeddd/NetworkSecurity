import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCars from "./ProductCards";
import { Alert, Spinner } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const ListProduct = () => {
  const [auctions, setAuctions] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
  });

  const [search, setSearch] = useState("");

  useEffect(() => {
    setAuctions({ ...auctions, loading: true });
    axios
      .get("http://localhost:4000/auctions", {
        withCredentials: true,
        params: {
          search: search,
        },
      })
      .then((resp) => {
        setAuctions({
          ...auctions,
          results: resp.data,
          loading: false,
          err: null,
        });
      })
      .catch((err) => {
        setAuctions({
          ...auctions,
          loading: false,
          err: "Something went wrong",
        });
      });
  }, [auctions.reload, search]); // Add search to the dependency array

  const searchAuction = (e) => {
    e.preventDefault();
    setAuctions({ ...auctions, reload: auctions.reload + 1 });
  };

  return (
    <div className="home-container p-5">
      {auctions.loading && (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">loading...</span>
        </Spinner>
      )}

      {/*filter */}
      <Form className="mb-3 " onSubmit={searchAuction}>
        <Form.Group className="mb-3 d-flex ">
          <Form.Control
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search Auction"
          />
          <Button className="btn btn-dark " type="submit">
            Submit
          </Button>
        </Form.Group>
      </Form>
      {!auctions.loading && auctions.err === null && (
        <>
          {/*list */}
          <div className="row">
            {auctions.results.map((product) => (
              <div className="col-3 card-containar" key={product.auction_id}>
                <ProductCars
                  name={product.auction_name}
                  description={product.description}
                  end_date={product.end_date}
                  image={product.image_url}
                  auction_id={product.auction_id}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {!auctions.loading && auctions.err !== null && (
        <Alert variant="danger" className="p-2">
          {auctions.err}
        </Alert>
      )}

      {!auctions.loading &&
        auctions.err === null &&
        auctions.results.length === 0 && (
          <Alert variant="info" className="p-2">
            No Auctions, Please try again.
          </Alert>
        )}
    </div>
  );
};

export default ListProduct;
