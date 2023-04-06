#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session, make_response, jsonify
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

# Local imports
from config import app, db, api
from models import User, Post, Profile, Event, Comment

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
        comments_dict = [comments.to_dict() for comments in comments]
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

        print("Got to post profile")

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

    def patch(self, id):
        profile = Profile.query.filter(Profile.id == id).first()
        data = request.get_json()

        if not profile:
            return make_response({
                "error": "Profile not found"
            }, 404)
        try:
            for attr in data:
                setattr(profile, attr, request.get_json()[attr])

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

                event = Post(
                    name=name,
                    user_id=session['user_id'],
                    location=location,
                    date=date
                )

                db.session.add(event)
                db.session.commit()

                return event.to_dict(), 201

            except IntegrityError:

                return {'error': '422 Unprocessable Entity'}, 422

        return {'error': '401 Unauthorized'}, 401

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

if __name__ == '__main__':
    app.run(port=5555, debug=True)
