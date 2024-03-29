"""empty message

Revision ID: acdaedb66951
Revises: efc4cd9b2801
Create Date: 2023-04-14 19:13:31.563257

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'acdaedb66951'
down_revision = 'efc4cd9b2801'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('chats',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('message', sa.String(), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('sender_id', sa.Integer(), nullable=True),
    sa.Column('receiver_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['receiver_id'], ['users.id'], name=op.f('fk_chats_receiver_id_users')),
    sa.ForeignKeyConstraint(['sender_id'], ['users.id'], name=op.f('fk_chats_sender_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('comments', schema=None) as batch_op:
        batch_op.add_column(sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True))
        batch_op.add_column(sa.Column('updated_at', sa.DateTime(), nullable=True))

    with op.batch_alter_table('events', schema=None) as batch_op:
        batch_op.add_column(sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True))
        batch_op.add_column(sa.Column('updated_at', sa.DateTime(), nullable=True))

    with op.batch_alter_table('posts', schema=None) as batch_op:
        batch_op.add_column(sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True))
        batch_op.add_column(sa.Column('updated_at', sa.DateTime(), nullable=True))

    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True))
        batch_op.add_column(sa.Column('updated_at', sa.DateTime(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('updated_at')
        batch_op.drop_column('created_at')

    with op.batch_alter_table('posts', schema=None) as batch_op:
        batch_op.drop_column('updated_at')
        batch_op.drop_column('created_at')

    with op.batch_alter_table('events', schema=None) as batch_op:
        batch_op.drop_column('updated_at')
        batch_op.drop_column('created_at')

    with op.batch_alter_table('comments', schema=None) as batch_op:
        batch_op.drop_column('updated_at')
        batch_op.drop_column('created_at')

    op.drop_table('chats')
    # ### end Alembic commands ###
