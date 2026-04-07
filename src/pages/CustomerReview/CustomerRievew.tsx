import "./CustomerReview.css";
// import { Carousel } from "../../assets/CarouselTest/CarouselTest";
import ReviewCard from "../../assets/reviewCard/ReviewCard";
import ReviewSummary from "../../assets/review/Review";

const reviews: any = [
  {
    id: 1,
    name: "John",
    rating: 4.5,
    isVerified: true,
    comment:
      "Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.",
  },
  {
    id: 2,
    name: "Sarah",
    rating: 5,
    isVerified: true,
    comment:
      "Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.",
  },
  {
    id: 3,
    name: "Mike",
    rating: 2.3,
    isVerified: false,
    comment:
      "Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.",
  },
  {
    id: 4,
    name: "Anna",
    rating: 4.9,
    isVerified: true,
    comment:
      "Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.",
  },
  {
    id: 5,
    name: "Ben",
    rating: 4.1,
    isVerified: true,
    comment:
      "Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.",
  },
];

const CustomerRievew = () => {
  return (
    <div className="root-customer-review">
      <div className="customer-review-overall">
        <ReviewSummary reviews={reviews} />
      </div>
      <div className="customer-review-carousel">
        {/* <Carousel data={[]} renderItem={() => <ReviewCard reviews={[]} />} /> */}
        <ReviewCard reviews={reviews} />
      </div>
    </div>
  );
};

export default CustomerRievew;
