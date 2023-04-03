from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin

from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-posts.user','-profiles.user','-_password_hash',)

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String)
     
    posts = db.relationship('Post', backref='user')
    profile = db.relationship('Profile', backref='user')
    user_events = db.relationship("UserEvent", backref="user")

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

class Post(db.Model, SerializerMixin):
    __tablename__ = 'posts'

    serialize_rules = ('-user',)

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    image = db.Column(db.String)
    description = db.Column(db.String)
    likes = db.Column(db.Integer, default=0)

    user_id = db.Column(db.Integer(), db.ForeignKey('users.id'))

    def __repr__(self):
        return f'<Post {self.id}: {self.title}>'

class Profile(db.Model, SerializerMixin):
    __tablename__ = 'profile'

    serialize_rules = ('-user.profile', '-user.id', '-user.username',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    image_url = db.Column(db.String, nullable=False)
    bio = db.Column(db.String, nullable=False)

    user_id = db.Column(db.Integer(), db.ForeignKey('users.id'))

    def __repr__(self):
        return f'<Post {self.id}: {self.bio}>'

class Event(db.Model, SerializerMixin):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    location = db.Column(db.String, nullable=False)
    date = db.Column(db.String, nullable=False)

    user_events = db.relationship("UserEvent", backref="events")

    def __repr__(self):
        return f'<Post {self.id}: {self.name}>'

class UserEvent(db.Model, SerializerMixin):
    __tablename__ = 'users_events'

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer(), db.ForeignKey('users.id'))
    event_id = db.Column(db.Integer(), db.ForeignKey('events.id'))


# Issues: 1. Cannot get accurate profile page 4. Sometimes the username is buggy