import {xml} from "d3-fetch"

/**
 * dealing with the I/O operations, e.g., read xml file
 *
 * @properties
 *   - data
 *     - locationTree
 *     - sessionTable
 *
 * @methods
 *   - readXMLFile()
 *   - constructSessionTable()
 *   - constructLocationTree()
 */
export class DataStore {
  // TODO: the construct func should init data even with null xml file.
  constructor() {
    this.Keytimeframe = [];
  }

  addKeytimeframe(time) {
    this.Keytimeframe.push(time);
  }



  async readXMLFile(fileSrc) {
    let xmldata= await xml(fileSrc);
    let locationTree = {},
    sessionTable = new Map();
    let story = xmldata.querySelector("Story");
    let characters = story.querySelector("Characters");
    sessionTable = this.constructSessionTable(characters);
    let locations = story.querySelector("Locations");
    if (locations) {
      let root = Array.from(locations.children);
      if (root.length != 1) {
        let tmp = document.createElement("Location");
        tmp.setAttribute("Sessions", "");
        tmp.setAttribute("Name", "All");
        root.forEach(x => tmp.appendChild(x));
        root = tmp;
      } else {
        root = root[0];
      }
      locationTree = this.constructLocationTree(root);
    }
    this.data = {
      locationTree: locationTree,
      sessionTable: sessionTable
    };

    return this.data;
    // )
    // .catch(error=>console.error(`file error in $error`));
    
  }

  addLocation(LocationName) {
    let locations = this.data.locationTree;
    locations.children.push({
      sessions: [],
      name: LocationName,
      children: [],
      visible: true
    });
  }

  constructSessionTable(characters) {
    let sessionTable = new Map();
    characters = characters.querySelectorAll("Character");
    for (let character of characters) {
      character.sessions = character.querySelectorAll("Span");
      for (let session of character.sessions) {
        let sessionId = Number(session.getAttribute("Session"));
        session.sessionId = sessionId;
        session.start = Number(session.getAttribute("Start"));
        session.end = Number(session.getAttribute("End"));
        let entityInfo = {
          start: session.start,
          end: session.end,
          entity: character.getAttribute("Name")
        };
        if (!sessionTable.has(sessionId)) {
          sessionTable.set(sessionId, [entityInfo]);
        } else {
          sessionTable.get(sessionId).push(entityInfo);
        }
      }
    }
    return sessionTable;
  }

  constructLocationTree(dom) {
    let root = {};
    if (dom === undefined) {
      return;
    }
    let sessions = dom.getAttribute("Sessions");
    root.sessions = sessions.split(",");
    if (sessions === "") {
      // otherwise "" results in [0] which is unexpected
      root.sessions = [];
    } else {
      root.sessions = root.sessions.map(v => Number(v));
    }
    // use name as id
    root.name = dom.getAttribute("Name");
    root.visible = Boolean(dom.getAttribute("Visible"));

    root.children = [];
    for (let child of dom.children) {
      root.children.push(this.constructLocationTree(child));
    }
    return root;
  }
}
// // read in xml string and return location tree and session table
// export function readFromXML(xml) {
//   let locationTree = {},
//     sessionTable = new Map();
//   let story = xml.querySelector("Story");

//   // characters array, add entities to SessionTable
//   let characters = story.querySelector("Characters");
//   if (characters) {
//     sessionTable = constructSessionTable(characters);
//   }
//   // this requires data with single root "All"
//   // if not, wo create a dummy root

//   // select direct children
//   // https://developer.mozilla.org/en-US/docs/Web/CSS/:scope
//   let locations = story.querySelector("Locations");
//   if (locations) {
//     let root = Array.from(locations.children);
//     if (root.length !== 1) {
//       let tmp = document.createElement("Location");
//       tmp.setAttribute("Sessions", "");
//       tmp.setAttribute("Name", "dummy");
//       root.forEach(x => tmp.appendChild(x));
//       root = tmp;
//     } else {
//       root = root[0];
//     }
//     locationTree = constructLocationTree(root);
//   }

//   return {
//     locationTree: locationTree,
//     sessionTable: sessionTable
//   };
// }

// function constructSessionTable(characters) {
//   let sessionTable = new Map();
//   characters = characters.querySelectorAll("Character");
//   for (let character of characters) {
//     // just give it an alias but not copy
//     character.sessions = character.querySelectorAll("Span");
//     for (let session of character.sessions) {
//       let sessionId = Number(session.getAttribute("Session"));
//       session.sessionId = sessionId;
//       session.start = Number(session.getAttribute("Start"));
//       session.end = Number(session.getAttribute("End"));
//       let entityInfo = {
//         start: session.start,
//         end: session.end,
//         entity: character.getAttribute("Name")
//       };
//       if (!sessionTable.has(sessionId)) {
//         sessionTable.set(sessionId, [entityInfo]);
//       } else {
//         sessionTable.get(sessionId).push(entityInfo);
//       }
//     }
//   }
//   return sessionTable;
// }

// // construct a copy a tree
// function constructLocationTree(dom) {
//   let root = {};
//   if (dom === undefined) {
//     return;
//   }
//   let sessions = dom.getAttribute("Sessions");
//   root.sessions = sessions.split(",");
//   if (sessions === "") {
//     // otherwise "" results in [0] which is unexpected
//     root.sessions = [];
//   } else {
//     root.sessions = root.sessions.map(v => Number(v));
//   }
//   // use name as id
//   root.name = dom.getAttribute("Name");
//   root.visible = Boolean(dom.getAttribute("Visible"));

//   root.children = [];
//   for (let child of dom.children) {
//     root.children.push(constructLocationTree(child));
//   }
//   return root;
// }