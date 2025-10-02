import axios from "axios";

export default async function useGetProducts(page) {
    const res = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${page}`);
   
    return res.data;
}
