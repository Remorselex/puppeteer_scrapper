import { load } from "cheerio";
import { pageHandler } from "../../index.js";


const handleItems = async (url, index) => {
  try {
    const pageData = [];
    const content = await pageHandler.getPageContent(url);
    const $ = await load(content);

    const rows = $(".views-table tbody tr");

    rows.each((i, row) => {
      const $row = $(row);
      const dishName = $row.find(".views-field-title").text().trim();
      const imgSrc = $row.find(".views-field-field-picture-fid img").attr("src");
      const protein = $row.find(".views-field-field-protein-value").text().trim();
      const fats = $row.find(".views-field-field-fat-value").text().trim();
      const carbohydrates = $row.find(".views-field-field-carbohydrate-value").text().trim();
      const kcal = $row.find(".views-field-field-kcal-value").text().trim();

      const currentDish = {
        id: `${index}${i}`,
        dish: dishName,
        imgSrc: imgSrc,
        protein: protein,
        fats: fats,
        carbohydrates: carbohydrates,
        kcal: kcal,
      };

      pageData.push({ ...currentDish });
    });

    return pageData;

  } catch (err) {
    console.error('Error:', err);
    console.error('Error stack:', err.stack);

  }

};

export { handleItems };