import inquirer from 'inquirer';
import fs from 'fs';
import { Command } from 'commander';
import { exit } from 'process';

const program = new Command();

const file_path = './courses.json';

const questions = [
  {
    type: 'input',
    name: 'namecourse1',
    message: 'Please Enter course title: ',
  },
  {
    type: 'input',
    name: 'nameinstractot',
    message: 'Please Enter instructor Name: ',
  },
  {
    type: 'number',
    name: 'price',
    message: 'Please Enter price: ',
  },
];

// ==========================
//       ADD COMMAND
// ==========================
program
  .command("add")
  .alias("a")
  .description("Add a new course")
  .action(() => {
    inquirer.prompt(questions).then((answers) => {

      if (fs.existsSync(file_path)) {
        
        fs.readFile(file_path, 'utf8', (err, data) => {
          if (err) {
            console.log("Error reading file", err);
            process.exit();
          }

          const jsonData = JSON.parse(data);  // array
          jsonData.push(answers);

          fs.writeFile(
            file_path,
            JSON.stringify(jsonData, null, 2),
            'utf8',
            () => console.log("Course added successfully!")
          );
        });

      } else {
        fs.writeFile(
          file_path,
          JSON.stringify([answers], null, 2), 
          'utf8',
          () => console.log("File created and course added!")
        );
      }
    });
  });

// ==========================
//       ADMIN LIST
// ==========================
program
  .command("admin")
  .alias("l")
  .description("List all courses")
  .action(() => {
    fs.readFile(file_path, 'utf8', (err, content) => {
      if (err) {
        console.log("Error", err);
        process.exit();
      }
      console.table(JSON.parse(content));
    });
  });


// ==========================
//       DELETE COMMAND
// ==========================
program
  .command("delete <courseName>")
  .alias("d")
  .description("Delete a course by name")
  .action((courseName) => {
    
    if (!fs.existsSync(file_path)) {
      console.log("No courses file found.");
      return;
    }

    fs.readFile(file_path, 'utf8', (err, data) => {
      if (err) {
        console.log("Error reading file", err);
        return;
      }

      let jsonData = JSON.parse(data);

      const newData = jsonData.filter(
        (course) => course.namecourse1.toLowerCase() !== courseName.toLowerCase()
      );

      if (newData.length === jsonData.length) {
        console.log(" Course not found!");
        return;
      }

      fs.writeFile(
        file_path,
        JSON.stringify(newData, null, 2),
        'utf8',
        () => console.log("Course deleted successfully!")
      );
    });

  });

// ==========================
//       PARSE
// ==========================
program.parse();
