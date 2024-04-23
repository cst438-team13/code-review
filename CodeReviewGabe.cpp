#include <iostream>
#include <fstream>
#include <sstream>
#include <algorithm>
#include <string>
using namespace std;

class User {
  public:
    string username;
    string displayName;
    string state;
    string friends[10];
};

class Post {
  public:
    string postID;
    string userID;
    string visibility;
};

void splitString(string& input, char delimiter, 
                 string arr[], int& index) 
{ 
    // Creating an input string stream from the input string 
    istringstream stream(input); 

    // Temporary string to store each token 
    string token; 

    // Read tokens from the string stream separated by the 
    // delimiter 
    while (getline(stream, token, delimiter)) { 
        // Add the token to the array 
        arr[index++] = token; 
    } 
} 

int main() {
  User user1;
  User user2;
  User user3;

  Post post1;
  Post post2;
  Post post3;
  
  bool statement = true;
  int userChoice;

  string placeHolder[100];
  string placeHolder2[100];
  string friends[10];
  string line;
  char delimiter = ';';
  char delimiter2 = ',';
  
  
  while(statement) {
    //Display Menu
    cout << "1. Load Input Data" << endl;
    cout << "2. Check Visibility" << endl;
    cout << "3. Retrieve Posts" << endl;
    cout << "4. Search users by location:" << endl;
    cout << "5. Exit:" << endl;

    cin >> userChoice;

    if(userChoice == 1){
      int lineCount = 0;
      int index2 = 0;
      int index = 0;
      
      cout << "Enter User.txt Filename: ";
      string filename;
      cin >> filename;

      //Handle File
      ifstream inFile;

      // Open the input file.
      inFile.open(filename);

      // Test for errors.
      if (!inFile) {
          cout << "Error opening the file.\n";
          return 0;
      }

      //Check to see how many lines the file has
      if (inFile.is_open()) {  // Checking if the file was successfully opened
      string lines;  // Declaring a string variable to store each line of text

      while (std::getline(inFile, lines)) {  // Loop through each line in the file
        lineCount++;  // Incrementing line count for each line read
      }
      }
      inFile.close();  // Closing the file after reading

        
      // Open the input file again to read the data
      inFile.open(filename);

      // Test for errors.
      if (!inFile) {
          cout << "Error opening the file.\n";
          return 0;
      }
        
      for(int i = 0; i < lineCount*2; i++){
        // Read the values from the file.
        inFile >> line;
        //Use splitString Function
        splitString(line, delimiter, placeHolder, index);
      }

      //Store Values in Correct User Spots
      user1.username = placeHolder[0];
      user1.displayName = placeHolder[1]+ " " + placeHolder[2];
      user1.state = placeHolder[3];
      user2.username = placeHolder[5];
      user2.displayName = placeHolder[6] + " " + placeHolder[7];
      user2.state = placeHolder[8];
      user3.username = placeHolder[10];
      user3.displayName = placeHolder[11] + " " + placeHolder[12];
      user3.state = placeHolder[13];

      
      //Split up and store friends 
      placeHolder[4].erase(remove(placeHolder[4].begin(), placeHolder[4].end(), '['), placeHolder[4].end()); //remove [ from string
        placeHolder[4].erase(remove(placeHolder[4].begin(), placeHolder[4].end(), ']'), placeHolder[4].end()); //remove ] from string

      splitString(placeHolder[4], delimiter2, friends, index2);  
      user1.friends[0] = friends[0];
      user1.friends[1] = friends[1];

      //User 2 Friends
      placeHolder[9].erase(remove(placeHolder[9].begin(), placeHolder[9].end(), '['), placeHolder[9].end()); //remove [ from string
      placeHolder[9].erase(remove(placeHolder[9].begin(), placeHolder[9].end(), ']'), placeHolder[9].end()); //remove ] from string

      splitString(placeHolder[9], delimiter2, friends, index2);  
      user2.friends[0] = friends[2];

      //User 3 Friends
      placeHolder[14].erase(remove(placeHolder[14].begin(), placeHolder[14].end(), '['), placeHolder[14].end()); //remove [ from string
      placeHolder[14].erase(remove(placeHolder[14].begin(), placeHolder[14].end(), ']'), placeHolder[14].end()); //remove ] from string

      splitString(placeHolder[14], delimiter2, friends, index2);  
      user3.friends[0] = friends[3];
      inFile.close();
      // for(int i = 0; i < 100; i++){
      //   cout << placeHolder[i] << endl;
      // }

      
      //Load Post Data
      cout << "Enter Post.txt Filename: ";
      string filename1;
      cin >> filename1;

      //Handle Post File
      inFile.open(filename1);

      // Test for errors.
      if (!inFile) {
          cout << "Error opening the file.\n";
          return 0;
      }

      //Assign Posts
      index2 = 0;
      inFile >> line;
      splitString(line, delimiter, placeHolder2, index2);
      post1.postID = placeHolder2[0];
      post1.userID = placeHolder2[1];
      post1.visibility = placeHolder2[2];

      index2 = 0;
      inFile >> line;
      splitString(line, delimiter, placeHolder2, index2);
      post2.postID = placeHolder2[0];
      post2.userID = placeHolder2[1];
      post2.visibility = placeHolder2[2];

      index2 = 0;
      inFile >> line;
      splitString(line, delimiter, placeHolder2, index2);
      post3.postID = placeHolder2[0];
      post3.userID = placeHolder2[1];
      post3.visibility = placeHolder2[2];
    }
      
    else if(userChoice == 2){
      string postID;
      string username;
      string visibility;
      
      cout << "Enter a Post ID: " << endl;
      cin >> postID;

      cout << "Enter a UserName: " << endl;
      cin >> username;

      if(postID == post1.postID){
        visibility = post1.visibility;
        //If visibility is friend, check user's friends and make sure they match given username
        if(visibility == "friend"){
          for(int i = 0; i < 2; i++){
            if(user1.friends[i] == username){
              cout << "Access Permitted" << endl;
            }
            else{
              cout << "Access Denied" << endl;
            }
          }
        }
      }
      else if(postID == post2.postID){
        visibility = post2.visibility;
        //If visibility is friend, check user's friends and make sure they match given username
        if(visibility == "friend"){
          for(int i = 0; i < 1; i++){
            if(user2.friends[i] == username){
              cout << "Access Permitted" << endl;
            }
            else{
              cout << "Access Denied" << endl;
            }
          }
        }
      }
      else if(postID == post3.postID){
        cout << "Access Permitted" << endl;
      }
    }
      
    else if(userChoice ==3){
      cout << "Enter a UserName: " << endl;
      string username;
      cin >> username;

      if(username == user1.username){
        cout << post2.postID << endl;
        cout << post3.postID << endl;
      }
      else if(username == user2.username){
        cout << post1.postID << endl;
      }
      else if(username == user3.username){
        cout << post1.postID << endl;
        cout << post2.postID << endl;
      }
    }
      
    else if(userChoice == 4){
      string state;
      cout << "Enter a State Abbreviation: ";
      cin >> state;

      if(state == user1.state){
        cout << "Display Name: " << user1.displayName << endl;
      }
      else if(state == user2.state){
        cout << "Display Name: " << user2.displayName << endl;
      }
      else if(state == user3.state){
        cout << "Display Name: " << user3.displayName << endl;
      }
    }
      
    else if(userChoice == 5){
      break;
    }
  }
}