# all users and posts
users = []
posts = []

# class hloding user info
class User:
  def __init__(self, username, displayName, state):
    self.username = username
    self.displayName = displayName
    self.state = state
    self.friends = []

  def addFriends(self, friends):
    self.friends.extend(friends)

  def __str__(self):
    return f'username: {self.username}\ndisplayName: {self.displayName}\nfriends: {self.friends}'
  
#class holding post info
class Post:
  def __init__(self, postId, username, visibility):
    self.postId = postId
    self.username = username
    self.visibility = visibility
  
  def __str__(self):
    return f'post id: {self.postId}\nusername: {self.username}\nvisibility: {self.visibility}'

def processUsers(file):
  usersInfo = file.readlines()
  for userInfo in usersInfo:
    # strip file line and split user info by ;
    userInfo.strip()
    userSplit = userInfo.split(';')

    # add user basic info
    user = User(userSplit[0], userSplit[1], userSplit[2])
    users.append(user)

    # adds friends to user
    friendSection = userSplit[3].strip('[]\n')
    friends = friendSection.split(',')
    user.addFriends(friends)

  return users

def processPosts(file):
  postsInfo = file.readlines()
  for postInfo in postsInfo:
    # strip line and add to post object
    postInfo.strip()
    postSplit = postInfo.split(';')
    post = Post(postSplit[0], postSplit[1], postSplit[2].strip('\n'))
    posts.append(post)

  return posts

# loading data from path
def loadInputData():
  try:
    userPath = input('Enter user information path: ')
    postPath = input('Enter post information path: ')

    userFile = open(userPath, 'r')
    postFile = open(postPath, 'r')
    users = processUsers(userFile)
    posts = processPosts(postFile)
  except:
    print('could not find file')
    loadInputData()

# get user by username
def getUser(username):
  for user in users:
    if user.username == username:
      return user

  return None

def canViewPost(post, username):
  if post.visibility == 'friend':
    user = getUser(post.username)
    if post.username == username:
      return True
      
    if username in user.friends:
      return True

    # not in friends list
    return False
  else:
    return True

# get visibility of post with post id and username
def getVisibility():
  id = input('Enter post id: ')
  username = input('Enter username: ')

  for post in posts:
    if post.postId == id:
      if canViewPost(post, username):
        print('Access Permitted\n')
        break
      else:
        print('Access Denied\n')
        break
        
def retrievePosts():
  username = input('Enter username: ')
  viewablePosts = []

  # getting all post user can see
  for post in posts:
    if canViewPost(post, username):
      viewablePosts.append(post.postId)
  
  print(f'Viewable posts: {viewablePosts}\n')

# returns list of users with same state as parameter
def getUsersByState(state):
  hits = []
  for user in users:
    if user.state == state:
      hits.append(user.displayName)
  
  return hits

def searchByLocation():
  state = input('Enter State: ')
  usersInState = getUsersByState(state)
  print(f'Users in {state}: {usersInState}\n')

# main program loop
def runProgram():
  while True:
    print('Assignment 2')
    print('1.\tLoad Input Data.')
    print('2.\tCheck Visibility.')
    print('3.\tRetrieve Posts.')
    print('4.\tSearch Users By Location.')
    print('5.\tExit.')
    try:
      selection = int(input("Enter option number(1-5): "))
    except:
      print('Not a number!\n')
      continue

    match selection:
      case 1:
        loadInputData()
        print('Data Loaded!\n')
      case 2:
        getVisibility() 
      case 3:
        retrievePosts()
      case 4:
        searchByLocation()
      case 5:
        print('Goodbye!\n')
        break
      case _:
        print('Invalid input, try again.\n')
    

def main():
  runProgram()

main()

