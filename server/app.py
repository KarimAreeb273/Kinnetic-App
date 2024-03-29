#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session, make_response, jsonify, render_template, redirect, url_for
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from flask_socketio import emit, join_room, leave_room, send

# Local imports
from config import app, db, api, socketio
from models import User, Post, Profile, Event, Comment, UserEvent, Follower, Followee, Contact

# Views go here!

class Users(Resource):
    def get(self):
        users = User.query.all()
        user_dict = [user.to_dict(rules=('-profile.user',)) for user in users]
        response = make_response(user_dict, 200)
        return response

class UserById(Resource):
    def get(self):

        if session.get('user_id'):

            user = User.query.filter(User.id == session['user_id']).first()

            return [user.to_dict(rules=('-profile.user',))], 200
        
        return {'error': '401 Unauthorized'}, 401

class Signup(Resource):
    
    def post(self):

        request_json = request.get_json()

        username = request_json.get('username')
        password = request_json.get('password')

        user = User(
            username=username,
        )

        # the setter will encrypt this
        user.password_hash = password

        print('first')

        try:

            print('here!')

            db.session.add(user)
            db.session.commit()

            session['user_id'] = user.id

            print(user.to_dict())

            return user.to_dict(), 201

        except IntegrityError:

            print('no, here!')
            
            return {'error': '422 Unprocessable Entity'}, 422

class CheckSession(Resource):
    
    def get(self):

        if session.get('user_id'):

            user = User.query.filter(User.id == session['user_id']).first()

            return user.to_dict(), 200

        return {'error': '401 Unauthorized'}, 401

class Login(Resource):
    
    def post(self):

        request_json = request.get_json()

        username = request_json.get('username')
        password = request_json.get('password')

        user = User.query.filter(User.username == username).first()

        if user:
            if user.authenticate(password):

                session['user_id'] = user.id
                return user.to_dict(), 200

        return {'error': '401 Unauthorized'}, 401

class Logout(Resource):
    
    def delete(self):
        
        if session.get('user_id'):
            
            session['user_id'] = None
            
            return {}, 204
        
        return {'error': '401 Unauthorized'}, 401

class Posts(Resource):

    def get(self):
        posts = Post.query.all()
        post_dict = [post.to_dict() for post in posts]
        response = make_response(post_dict, 200)
        return response
        
    def post(self):

        if session.get('user_id'):

            request_json = request.get_json()

            title = request_json['title']
            image = request_json['image']
            description = request_json['description']

            try:

                post = Post(
                    title=title,
                    user_id=session['user_id'],
                    image=image,
                    description=description
                )

                db.session.add(post)
                db.session.commit()

                return post.to_dict(), 201

            except IntegrityError:

                return {'error': '422 Unprocessable Entity'}, 422

        return {'error': '401 Unauthorized'}, 401

class PostsById(Resource):
    def get(self, id):
        posts = Post.query.filter(Post.id == id).first()
        if not posts: 
            return make_response({"error": "Post not found"}, 404)
        posts_dict = posts.to_dict()
        response = make_response(posts_dict, 200)
        return response

    def patch(self, id):
        post = Post.query.filter_by(id == id).first()
        data = request.get_json()

        if not post:
            return make_response({
                "error": "Post not found"
            }, 404)
        try:
            for attr in data:
                setattr(post, attr, data[attr])

            db.session.add(post)
            db.session.commit()

            post_dict = post.to_dict()

            return make_response(
                jsonify(post_dict),
                200
            )

        except Exception as e:
            return make_response({ "error": "Invalid input" }, 400)

class PostsByOthers(Resource):
    def get(self, id):
        posts = Post.query.filter(Post.user_id == id).all()
        if not posts: 
            return make_response({"error": "Post not found"}, 404)
        post_dict = [post.to_dict() for post in posts]
        response = make_response(post_dict, 200)
        return response

class PostsByUser(Resource):
    def get(self):

        if session.get('user_id'):

            user = User.query.filter(User.id == session['user_id']).first()

            return [posts.to_dict() for posts in user.posts], 200
        
        return {'error': '401 Unauthorized'}, 401

class Comments(Resource):
    def get(self, id):
        comments = Comment.query.filter(Comment.post_id == id).all()
        comments_dict = [comment.to_dict() for comment in comments]
        response = make_response(comments_dict, 200)
        return response
    
    def post(self, id):
        print(request.get_json())
        new_comment = Comment(
            text = request.get_json()['text'],
            post_id = request.get_json()['post_id'],
            user_id = request.get_json()['user_id']
        )   
        db.session.add(new_comment)
        db.session.commit()
        return new_comment.to_dict(), 201

class Profiles(Resource):

    def get(self):

        if session.get('user_id'):

            user = User.query.filter(User.id == session['user_id']).first()

            return [profile.to_dict() for profile in user.profile], 200
        
        return {'error': '401 Unauthorized'}, 401

    def post(self):

        if session.get('user_id'):

            request_json = request.get_json()

            name = request_json['name']
            image_url = request_json['image']
            bio = request_json['bio']

            try:

                profile = Profile(
                    name=name,
                    image_url=image_url,
                    bio=bio,
                    user_id=session['user_id'],
                )

                db.session.add(profile)
                db.session.commit()

                return profile.to_dict(), 201

            except IntegrityError:

                return {'error': '422 Unprocessable Entity'}, 422

        return {'error': '401 Unauthorized'}, 401

    def patch(self):
        profile = Profile.query.filter(Profile.id == session['user_id']).first()

        if not profile:
            return make_response({
                "error": "Profile not found"
            }, 404)

        if session.get('user_id') != profile.user_id:
            return make_response({
            "error": "Unauthorized"
        }, 401)

        data = request.get_json()
        try:
            for attr in data:
                setattr(profile, attr, data[attr])

            db.session.add(profile)
            db.session.commit()

            profile_dict = profile.to_dict()

            return make_response(
                jsonify(profile_dict),
                200
            )

        except Exception as e:
            return make_response({ "error": "Invalid input" }, 400)

class ProfileById(Resource):
    def get(self, id):
        profiles = Profile.query.filter(Profile.id == id).first()
        if not profiles: 
            return make_response({"error": "Profile not found"}, 404)
        profiles_dict = profiles.to_dict()
        response = make_response(profiles_dict, 200)
        return response

class AllProfiles(Resource):
    def get(self):
        profiles = Profile.query.all()
        profile_dict = [profile.to_dict(rules=('-profile.user',)) for profile in profiles]
        response = make_response(profile_dict, 200)
        return response

class Events(Resource):
    def get(self):
        events = Event.query.all()
        event_dict = [event.to_dict() for event in events]
        response = make_response(event_dict, 200)
        return response
    def post(self):

        if session.get('user_id'):

            request_json = request.get_json()

            name = request_json['name']
            location = request_json['location']
            date = request_json['date']

            try:

                event = Event(
                    name=name,
                    location=location,
                    date=date
                )

                db.session.add(event)
                db.session.commit()

                return event.to_dict(), 201

            except IntegrityError:

                return {'error': '422 Unprocessable Entity'}, 422

        return {'error': '401 Unauthorized'}, 401
class EventsById(Resource):
    def get(self, id):
        posts = Event.query.filter(Event.id == id).first()
        if not posts: 
            return make_response({"error": "Post not found"}, 404)
        posts_dict = posts.to_dict()
        response = make_response(posts_dict, 200)
        return response

class UserEvents(Resource):
    def get(self):

        if session.get('user_id'):

            user = User.query.filter(User.id == session['user_id']).first()

            return [userevents.to_dict() for userevents in user.user_events], 200
        
        return {'error': '401 Unauthorized'}, 401
    def post(self):
        if session.get('user_id'):
            new = request.get_json()
            try:
                new_events = UserEvent (
                    user_id = new['user_id'],
                    is_going = new['is_going'],
                    event_id = new['event_id']
                )

                db.session.add(new_events)
                db.session.commit()

                new_events_dict = new_events.to_dict()
                response = make_response(new_events_dict, 201)
                return response
            except IntegrityError:
                return {'error': '422 Unprocessable Entity'}, 422
        return {'error': '401 Unauthorized'}, 401

class UserEventByIDS(Resource):
    def get(self, event_id, user_id):

        if session.get('user_id'):
            user_event = UserEvent.query.filter_by(event_id=event_id, user_id=user_id).first()
            if user_event is None:
                return jsonify({'result': False})
            else:
                return jsonify({'result': True})
        
        return {'error': '401 Unauthorized'}, 401
class UserEventById(Resource):
    def get(self, id):

        if session.get('user_id'):

            user = UserEvent.query.filter(UserEvent.id == id).first()
            user_dict = user.to_dict()
            response = make_response(user_dict, 200)
            return response
        
        return {'error': '401 Unauthorized'}, 401
    def delete(self, id):
        print(id)
        rem_events = UserEvent.query.filter(UserEvent.user_id == id).first()
        if not rem_events: 
            return make_response({"error": "Event not found"}, 404)
        db.session.delete(rem_events)
        db.session.commit()
        response = make_response({}, 200)
        return response

class UserEventsInID(Resource):
    def get(self, id):

            user = UserEvent.query.filter(UserEvent.event_id == id).all()
            user_dict = [userevents.to_dict() for userevents in user]
            response = make_response(user_dict, 200)
            return response
        
class Followers(Resource):
    def get(self, id):
        followers = Follower.query.filter_by(follower_id=id).all()
        follower_dict = [follower.to_dict() for follower in followers]
        response = make_response(follower_dict, 200)
        return response
    def post(self, id):
        if session.get('user_id'):
            new = request.get_json()
            try:
                new_follower = Follower(
                    follower_id = session['user_id'],
                    profile_id = new['profile_id'],
                    is_following = new['is_following'],
                )

                db.session.add(new_follower)
                db.session.commit()

                new_follower_dict = new_follower.to_dict()
                response = make_response(new_follower_dict, 201)
                return response
            except IntegrityError:
                return {'error': '422 Unprocessable Entity'}, 422
        return {'error': '401 Unauthorized'}, 401
    def delete(self, id):
        if session.get('user_id'):
            follower = Follower.query.filter_by(
                follower_id=session['user_id'],
                profile_id=id
            ).first()
            if not follower:
                return make_response({"error": "Follower not found"}, 404)
            db.session.delete(follower)
            db.session.commit()
            return make_response({"message": "Unfollowed successfully"}, 200)
        return {'error': '401 Unauthorized'}, 401

class Followed(Resource):
    def get(self, id):
        followers = Follower.query.filter_by(profile_id=id).all()
        follower_dict = [follower.to_dict() for follower in followers]
        response = make_response(follower_dict, 200)
        return response   
class FollowerByIDS(Resource):
    def get(self, follower_id, profile_id):

        if session.get('user_id'):
            followers = Follower.query.filter_by(follower_id=follower_id, profile_id=profile_id).first()
            if followers is None:
                return jsonify({'result': False})
            else:
                return jsonify({'result': True})
        
        return {'error': '401 Unauthorized'}, 401
class Followees(Resource):
    def get(self, id):
        followees = Followee.query.filter_by(following_id=id).all()
        if not followees: 
            return make_response({"error": "Followee not found"}, 404)
        followee_dict = [followee.to_dict() for followee in followees]
        response = make_response(followee_dict, 200)
        return response
    def post(self, id):
        if session.get('user_id'):
            try:
                new_follower = Followee(
                    following_id = session['user_id']
                )

                db.session.add(new_follower)
                db.session.commit()

                new_follower_dict = new_follower.to_dict()
                response = make_response(new_follower_dict, 201)
                return response
            except IntegrityError:
                return {'error': '422 Unprocessable Entity'}, 422
        return {'error': '401 Unauthorized'}, 401

# class Chats(Resource):
#     def get(self):
#         chats = Chat.query.filter(Chat.sender_id == session['user_id']).all()
#         chat_list_dict = [chat.to_dict(rules=('-user',)) for chat in chats]
#         response = make_response(chat_list_dict, 200)
#         return response
# #     def post(self):
#         if session.get('user_id'):
#             data = request.get_json()
#             try:
#                 new_chat = Chat(
#                     message = data['message'],
#                     receiver_id = data['receiver_id'],
#                     sender_id = session['user_id']
#                 )

#                 db.session.add(new_chat)
#                 db.session.commit()

#                 new_chat_dict = new_chat.to_dict()
#                 response = make_response(new_chat_dict, 201)
#                 return response
#             except IntegrityError:
#                 return {'error': '422 Unprocessable Entity'}, 422
#         return {'error': '401 Unauthorized'}, 401

# class ChatsFiltered(Resource):
#     def get(self, user1_id, user2_id):
#         chats = Chat.query.filter((Chat.sender_id == user1_id) | (Chat.sender_id == user2_id)) \
#                           .filter((Chat.receiver_id == user1_id) | (Chat.receiver_id == user2_id)) \
#                           .order_by(Chat.created_at.asc()) \
#                           .all()

#         chat_list_dict = [chat.to_dict() for chat in chats]
#         response = make_response(chat_list_dict, 200)
#         return response


class Contacts(Resource):
    def get(self):
        if not session.get('user_id'):
            return {'error': '401 Unauthorized'}, 401

        user = User.query.filter_by(id=session['user_id']).first()

        if not user:
            return {'error': '404 User not found'}, 404

        contacts = Contact.query.filter_by(user_id=user.id).all()

        return [contact.to_dict() for contact in contacts], 200


    def post(self):
        if not session.get('user_id'):
            return {'error': '401 Unauthorized'}, 401

        user = User.query.filter_by(id=session['user_id']).first()

        if not user:
            return {'error': '404 User not found'}, 404

        data = request.get_json()

        name = data['name']
        email = data['email']
        phone = data['phone']

        if not name or not email:
            return {'error': '400 Name and email are required'}, 400

        contact = Contact(name=name, email=email, phone=phone, user_id=user.id)

        try:
            db.session.add(contact)
            db.session.commit()
            return contact.to_dict, 201
        except:
            db.session.rollback()
            return {'error': '500 Internal Server Error'}, 500

@socketio.on('message')
def handle_message(message):
    emit('message', message, broadcast=True)

@socketio.on('joinRoom')
def on_join(data):
    room = data['roomId']
    join_room(room)

@socketio.on('leaveRoom')
def on_leave(data):
    room = data['roomId']
    leave_room(room)

@socketio.on('sendMessage')
def on_send_message(data):
    room = data['roomId']
    newMessage = {
        'fromUser': data['fromUser'],
        'toUser': data['toUser'],
        'message': data['message'],
    }
    socketio.emit('newMessage', newMessage, room=room)

# @socketio.on('connect')
# def connect():
#     # Get user ID from Flask session
#     user_id = session['user_id']
#     join_room(user_id)

# @socketio.on('join')
# def on_join(data):
#     username = data['username']
#     room = data['room']
#     join_room(room)
#     emit('join_room', f'{username} has entered the room.', room=room)

# @socketio.on('leave')
# def on_leave(data):
#     username = data['username']
#     room = data['room']
#     leave_room(room)
#     emit('leave_room', f'{username} has left the room.', room=room)

# @socketio.on('send_message')
# def on_send_message(data):
#     message = data['message']
#     recipient = data['recipient']
#     sender = data['sender']
#     room = f'{recipient}-{sender}'

#     if recipient != sender:
#         join_room(room)
#         emit('receive_message', {'message': message, 'sender': sender}, room=room)
#     else:
#         emit('error_message', {'message': 'You cannot send a message to yourself.'}, room=request.sid)
    # print(f"Message sent: '{message}' from {sender_id} to {receiver_id}")

api.add_resource(Users, '/users', endpoint='users')
api.add_resource(UserById, '/usersbyid', endpoint='usersbyid')
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(Posts, '/posts', endpoint='posts')
api.add_resource(PostsById, '/posts/<int:id>', endpoint='posts/<int:id>')
api.add_resource(PostsByOthers, '/postsbyothers/<int:id>', endpoint='postsbyothers/<int:id>')
api.add_resource(PostsByUser, '/postsbyuser', endpoint='postsbyuser')
api.add_resource(Comments, '/comments/<int:id>', endpoint='comments/<int:id>')
api.add_resource(Profiles, '/profiles', endpoint='profiles')
api.add_resource(ProfileById, '/profiles/<int:id>', endpoint='profiles/<int:id>')
api.add_resource(AllProfiles, '/allprofiles', endpoint='allprofiles')
api.add_resource(Events, '/events', endpoint='events')
api.add_resource(EventsById, '/events/<int:id>', endpoint='events/<int:id>')
api.add_resource(UserEvents, '/userevents', endpoint='userevents')
api.add_resource(UserEventByIDS, '/events/<int:event_id>/users/<int:user_id>', endpoint='events/<int:event_id>/users/<int:user_id>')
api.add_resource(UserEventById, '/userevent/<int:id>', endpoint='userevent/<int:id>')
api.add_resource(UserEventsInID, '/userevents/<int:id>', endpoint='userevents/<int:id>')
api.add_resource(Followers, '/followers/<int:id>', endpoint='followers/<int:id>')
api.add_resource(Followed, '/followed/<int:id>', endpoint='followed/<int:id>')
api.add_resource(FollowerByIDS, '/follower/<int:follower_id>/profile/<int:profile_id>', endpoint='follower/<int:follower_id>/profile/<int:profile_id>')
api.add_resource(Followees, '/followees/<int:id>', endpoint='followees/<int:id>')
# api.add_resource(ChatsFiltered, '/chats/<int:user1_id>/<int:user2_id>', endpoint='chats/<int:user1_id>/<int:user2_id>')
# api.add_resource(Chats, '/chats', endpoint='chats')
api.add_resource(Contacts, '/contacts', endpoint='contacts')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

