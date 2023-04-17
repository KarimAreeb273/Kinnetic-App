#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session, make_response, jsonify, render_template, redirect, url_for
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from flask_socketio import emit, join_room, leave_room

# Local imports
from config import app, db, api, socketio
from models import User, Post, Profile, Event, Comment, UserEvent, Follower, Followee, Chat

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

class PostsByUser(Resource):
    def get(self):

        if session.get('user_id'):

            user = User.query.filter(User.id == session['user_id']).first()

            return [posts.to_dict() for posts in user.posts], 200
        
        return {'error': '401 Unauthorized'}, 401

class Comments(Resource):
    def get(self):
        comments = Comment.query.filter(Comment.post_id == Post.id).all()
        comments_dict = [comment.to_dict() for comment in comments]
        response = make_response(comments_dict, 200)
        return response
    
    def post(self):
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

class UserEventById(Resource):
    def delete(self, id):
        print(id)
        rem_events = UserEvent.query.filter(UserEvent.user_id == id).first()
        if not rem_events: 
            return make_response({"error": "Event not found"}, 404)
        db.session.delete(rem_events)
        db.session.commit()
        response = make_response({}, 200)
        return response

class Followers(Resource):
    def get(self, id):
        followers = Follower.query.filter_by(follower_id=id).all()
        if not followers: 
            return make_response({"error": "Follower not found"}, 404)
        follower_dict = [follower.to_dict() for follower in followers]
        response = make_response(follower_dict, 200)
        return response
    def post(self, id):
        if session.get('user_id'):
            try:
                new_follower = Follower(
                    follower_id = session['user_id']
                )

                db.session.add(new_follower)
                db.session.commit()

                new_follower_dict = new_follower.to_dict()
                response = make_response(new_follower_dict, 201)
                return response
            except IntegrityError:
                return {'error': '422 Unprocessable Entity'}, 422
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

class Chats(Resource):
    def get(self):
        users = Chat.query.all()
        user_dict = [user.to_dict() for user in users]
        response = make_response(user_dict, 200)
        return response

@app.route('/chat', methods=['GET', 'POST'])
def chat():
    if(request.method=='POST'):
        username = request.form['username']
        room = request.form['room']
        #Store the data in session
        session['username'] = username
        session['room'] = room
        return render_template('chat.html', session = session)
    else:
        if(session.get('username') is not None):
            return render_template('chat.html', session = session)
        else:
            return redirect(url_for('index'))

@socketio.on('connect')
def connect():
    id = request.args.get('id')
    join_room(id)

@socketio.on('send-message')
def send_message(data):
    recipients = data['recipients']
    text = data['text']
    sender_id = request.args.get('id')

    for recipient in recipients:
        new_recipients = [r for r in recipients if r != recipient]
        new_recipients.append(sender_id)
        emit('receive-message', {
            'recipients': new_recipients,
            'sender': sender_id,
            'text': text
        }, room=recipient)


api.add_resource(Users, '/users', endpoint='users')
api.add_resource(UserById, '/usersbyid', endpoint='usersbyid')
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(Posts, '/posts', endpoint='posts')
api.add_resource(PostsById, '/posts/<int:id>', endpoint='posts/<int:id>')
api.add_resource(PostsByUser, '/postsbyuser', endpoint='postsbyuser')
api.add_resource(Comments, '/comments', endpoint='comments')
api.add_resource(Profiles, '/profiles', endpoint='profiles')
api.add_resource(ProfileById, '/profiles/<int:id>', endpoint='profiles/<int:id>')
api.add_resource(AllProfiles, '/allprofiles', endpoint='allprofiles')
api.add_resource(Events, '/events', endpoint='events')
api.add_resource(UserEvents, '/userevents', endpoint='userevents')
api.add_resource(UserEventById, '/userevent/<int:id>', endpoint='userevents/<int:id>')
api.add_resource(Followers, '/followers/<int:id>', endpoint='followers/<int:id>')
api.add_resource(Followees, '/followees/<int:id>', endpoint='followees/<int:id>')
api.add_resource(Chats, '/chats', endpoint='chats')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
    socketio.run(app)
