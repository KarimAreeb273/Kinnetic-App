from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates

from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-posts.user','-profiles.user','-_password_hash','-user_events.user',"-comments.user","-profile.user",)


    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
     
    posts = db.relationship('Post', backref='user')
    comments = db.relationship('Comment', backref='user')
    profile = db.relationship('Profile', backref='user')
    user_events = db.relationship("UserEvent", backref="user")
    follower = db.relationship('Follower', backref='user')
    followee = db.relationship('Followee', backref='user')
    contacts = db.relationship('Contact', backref='user')

    # sent_chats = db.relationship('Chat', foreign_keys='Chat.sender_id',
    #                               backref='sender')
    # received_chats = db.relationship('Chat', foreign_keys='Chat.receiver_id',
    #                                   backref='receiver')

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))

    def __repr__(self):
        return f'<User {self.username}>'

    @validates('username')
    def validate_username(self, key, value):
        user = User.query.filter(User.username == value).first()
        if user and user.id != self.id:
            raise ValueError('Username is already taken.')
        return value

class Post(db.Model, SerializerMixin):
    __tablename__ = 'posts'

    serialize_rules = ('-user.posts',)

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    image = db.Column(db.String)
    description = db.Column(db.String)
    likes = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    posts = db.relationship('Comment', backref='post')

    user_id = db.Column(db.Integer(), db.ForeignKey('users.id'))

    def __repr__(self):
        return f'<Post {self.id}: {self.title}>'
class Comment(db.Model, SerializerMixin):
    __tablename__ = 'comments'

    serialize_rules = ('-post', "-user",)

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    def __repr__(self):
        return f'<Comment {self.id}: {self.text}>'

class Profile(db.Model, SerializerMixin):
    __tablename__ = 'profile'

    serialize_rules = ('-user.profile', '-user.id', '-user.username',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    image_url = db.Column(db.String, nullable=False)
    bio = db.Column(db.String, nullable=False)

    user_id = db.Column(db.Integer(), db.ForeignKey('users.id'))
    followers = db.relationship("Follower", backref="profile")

    def __repr__(self):
        return f'<Post {self.id}: {self.bio}>'

class Event(db.Model, SerializerMixin):
    __tablename__ = 'events'

    serialize_rules = ('-user_events',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    location = db.Column(db.String, nullable=False)
    date = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())


    user_events = db.relationship("UserEvent", backref="events")

    def __repr__(self):
        return f'<Event {self.id}: {self.name}>'

class UserEvent(db.Model, SerializerMixin):
    __tablename__ = 'users_events'

    serialize_rules = ('-user.user_events','-events.user_events','-user.profile','-user.posts','-user.comments')

    id = db.Column(db.Integer, primary_key=True)
    is_going = db.Column(db.Boolean, default=False)

    user_id = db.Column(db.Integer(), db.ForeignKey('users.id'))
    event_id = db.Column(db.Integer(), db.ForeignKey('events.id'))

    # def to_dict(self):
    #     return {
    #         'is_going': self.is_going
    #     }

class Follower(db.Model, SerializerMixin):
    __tablename__ = 'followers'

    serialize_rules = ('-user','-profile',)

    id = db.Column(db.Integer, primary_key=True)
    is_following = db.Column(db.Boolean, default=False)
    follower_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    profile_id = db.Column(db.Integer(), db.ForeignKey('profile.id'))

    def __repr__(self):
        return f'<Follower {self.id}: {self.follower_id}>'

class Followee(db.Model, SerializerMixin):
    __tablename__ = 'followee'

    serialize_rules = ('-user',)

    id = db.Column(db.Integer, primary_key=True)
    following_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def __repr__(self):
        return f'<Followee {self.id}: {self.following_id}>'

# class Chat(db.Model, SerializerMixin):
#     __tablename__ = 'chats'

#     serialize_rules = ('-user',)

#     id = db.Column(db.Integer, primary_key=True)
#     message = db.Column(db.String, nullable=False)
#     created_at = db.Column(db.DateTime, server_default=db.func.now())
#     updated_at = db.Column(db.DateTime, onupdate=db.func.now())

#     sender_id = db.Column(db.Integer(), db.ForeignKey('users.id'))
#     receiver_id = db.Column(db.Integer(), db.ForeignKey('users.id'))

#     def __repr__(self):
#         return f'<Chat {self.id}: {self.message}>'

class Contact(db.Model, SerializerMixin):
    __tablename__ = 'contacts'

    serialize_rules = ('-user',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False)
    phone = db.Column(db.String, nullable=True)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    def to_dict(self):
        return {
            'name': self.name,
            'email': self.email,
            'phone': self.phone
        }

    def __repr__(self):
        return f'<Contact {self.name}>'


