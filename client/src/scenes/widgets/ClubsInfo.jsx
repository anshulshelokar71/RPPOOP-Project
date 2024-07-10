import { Button ,Tooltip,Box} from "@mui/material";
import {
    DataGrid,
    GridToolbar,
    GridToolbarColumnsButton,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarFilterButton,
    GridToolbarContainer,
  } from "@mui/x-data-grid";
  
import React from "react";
import { useState } from "react";

function CustomToolbar() {
    
    return (
      <GridToolbarContainer
        sx={{ backgroundColor: "#00A0BC", borderRadius: "4px 4px 0 0" }}
      >
        <GridToolbarColumnsButton
          style={{ color: "#FFFFFF", fontSize: "1.2rem" }}
        />
        <GridToolbarFilterButton
          style={{ color: "#FFFFFF", fontSize: "1.2rem" }}
        />
        <GridToolbarDensitySelector
          style={{ color: "#FFFFFF", fontSize: "1.2rem" }}
        />
        <GridToolbarExport style={{ color: "#FFFFFF", fontSize: "1.2rem" }} />
        
      </GridToolbarContainer>
    );
  }
  

export const ClubsInfo = () => {

    const [questionId, setQuestionId] = useState("");
  const columns = [
    // { field: 'userId', headerName: 'ID', width: 90 },
    {
      field: "Clubs/Fests",
      headerName: "CLUBS/FESTS",
      width: 400,
      editable: true,
    },
    {
      field: "links",
      headerName: "Links",
      width: 350,
      editable: true,
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 150,
      renderCell: (params) => {
        return (
          <Box>
            <Tooltip title="Click Here">
              <Button onClick={() => handleLink(params)}>Click Here</Button>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  // const handleLink= (params) => {
  //   // console.log(params);
  //   setQuestionId(params.id);
  //   window.open(params.row.links)
    
  // };
  const handleLink = (params) => {
    window.open(params.row.links, "_blank");
  };

  const rows = [
    {
      id: 1,
      "Clubs/Fests": "Software Development Section",
      links: "https://www.coep.org.in/sds/",
    },
    {
      id: 2,
      "Clubs/Fests": "Robot Study Circle",
      links: "https://www.coeprobotics.com/",
    },
    {
      id: 3,
      "Clubs/Fests": "Aerial Robot Study Circle",
      links: "https://www.coep.org.in/content/aerialrobotstudycirclearsc",
    },
    {
      id: 4,
      "Clubs/Fests": "Data Science & AI",
      links: "https://www.coep.org.in/dsai/",
    },
    {
      id: 5,
      "Clubs/Fests": "COFSUG",
      links: "http://groups.google.com/group/cofsug?lnk=srg",
    },
    {
      id: 6,
      "Clubs/Fests": "Civil Services Aspirant Club",
      links: "https://www.coep.org.in/CSAC/",
    },
    {
      id: 7,
      "Clubs/Fests": "ZEST",
      links: "https://www.coepzest.org/",
    },
    {
      id: 8,
      "Clubs/Fests": "MINDSPARK",
      links: "https://www.mind-spark.org/",
    },
    {
      id: 9,
      "Clubs/Fests": "PSF",
      links: "https://www.punestartupfest.in/",
    },
    {
      id: 10,
      "Clubs/Fests": "IMPRESSIONS",
      links: "https://impressionscoeptech.com/",
    },
    {
      id: 11,
      "Clubs/Fests": "REGATTA",
      links: "https://coepregatta.com/",
    },
    {
      id: 12,
      "Clubs/Fests": "CSAT",
      links: "https://www.coep.org.in/clubs/satellite_team",
    },
    {
      id: 13,
      "Clubs/Fests": "Drama And Film Club",
      links: "https://www.coep.org.in/content/clubs",
    },
    {
      id: 14,
      "Clubs/Fests": "Arts and Crafts",
      links: "https://www.coep.org.in/content/clubs",
    },
    {
      id: 15,
      "Clubs/Fests": "Abhiyanta",
      links: "https://www.coep.org.in/content/clubs",
    },
    {
      id: 16,
      "Clubs/Fests": "Student Welfare Forum",
      links: "https://www.coep.org.in/content/clubs",
    },
    {
      id: 17,
      "Clubs/Fests": "Debate Club",
      links: "https://www.coep.org.in/content/clubs",
    },
    {
      id: 18,
      "Clubs/Fests": "Astronomy Club",
      links: "https://www.coep.org.in/content/clubs",
    },
    {
      id: 19,
      "Clubs/Fests": "History Club",
      links: "https://www.coep.org.in/content/clubs",
    },
    {
      id: 20,
      "Clubs/Fests": "Ramanuj Maths Club",
      links: "https://www.coep.org.in/content/clubs",
    },
    {
      id: 21,
      "Clubs/Fests": "Ham Club",
      links: "https://www.coep.org.in/content/clubs",
    },
    {
      id: 22,
      "Clubs/Fests": "Computer Society of India",
      links: "https://www.coep.org.in/content/clubs",
    },
    {
      id: 23,
      "Clubs/Fests": "Aarya Raas",
      links: "https://www.coep.org.in/content/clubs",
    },
    {
      id: 24,
      "Clubs/Fests": "Consulting Club",
      links: "https://www.coep.org.in/content/clubs",
    },
    {
      id: 25,
      "Clubs/Fests": "Science Club",
      links: "https://www.coep.org.in/content/clubs",
    },
  ];
  return (
    <>
      <div style={{marginBottom:"4rem"}}><h2 style={{marginLeft: "6rem", }}>Clubs Info</h2><hr/></div>
      <div style={{ width: "75%", margin: "auto" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          slots={{
            toolbar: CustomToolbar
          }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
          IsReadOnly="True"
        />
      </div>
    </>
  );
};
