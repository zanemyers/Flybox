const fs = require("fs");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const filePath = "GoogleMapsScraper/shop_details.csv"; // Declare filePath here

const csvWriter = createCsvWriter({
  path: filePath,
  header: [
    { id: "index", title: "Index" },
    { id: "name", title: "Name" },
    { id: "category", title: "Category" },
    { id: "phone", title: "Phone" },
    { id: "email", title: "Email" },
    { id: "hasWebsite", title: "Has Website" },
    { id: "website", title: "Website" },
    { id: "sellsOnline", title: "Sells Online" },
    { id: "stars", title: "Stars" },
    { id: "reviewCount", title: "Review Count" },
    { id: "hasFishingReport", title: "Publishes Fishing Report" },
    { id: "socialMedia", title: "Social Media Platforms" },
  ],
  append: true,
});

// Function to check if the file exists and is empty
function resetFile() {
  if (fs.existsSync(filePath)) {
    // If the file exists, clear it
    fs.writeFileSync(filePath, ""); // Clears the file contents
  }

  // Write the header to the file
  csvWriter.writeRecords([
    {
      index: "Index",
      name: "Name",
      category: "Category",
      phone: "Phone",
      email: "Email",
      hasWebsite: "Has Website",
      website: "Website",
      sellsOnline: "Sells Online",
      stars: "Stars",
      reviewCount: "Review Count",
      hasFishingReport: "Publishes Fishing Report",
      socialMedia: "Social Media Platforms",
    },
  ]);
}

// Function to write shop details to the CSV file
async function writeShopDetails(shopDetails) {
  await csvWriter.writeRecords([shopDetails]);
}

// Clean the file and write the header for a new run
resetFile();

module.exports = { writeShopDetails };
