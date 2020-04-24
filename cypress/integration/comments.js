/// <reference types="cypress" />

describe('Comments', () => {
  beforeEach(() => {
    cy.server()
    cy.route({
      method: 'GET',
      url: '**/comments',
      response: [
        {
          id: 1,
          title: 'comment 1',
          content: 'content 1...',
        },
        {
          id: 2,
          title: 'comment 2',
          content: 'content 2...',
        },
      ],
    })
    cy.route({
      method: 'GET',
      url: '**/comments/1',
      response: {
        id: 1,
        title: 'content 1',
        content: 'content 1 detailed',
        video: '/smile.mp4',
      },
    }).as('commentDetail1')
    cy.visit('/')
  })

  it('has the comments', () => {
    cy.contains('h1', 'Comments')
    cy.contains('comment 1')
    cy.contains('content 1...')
  })

  it('can expand and collapse the comment', () => {
    cy.get('button[aria-label="Show more"]').first().click()
    cy.wait('@commentDetail1')
    cy.contains('content 1 detailed')
    cy.get('button[aria-label="Show less"]').first().click()
    cy.contains('content 1 detailed').should('not.exist')
    cy.contains('content 1...')
  })
})

describe('Comments Error', () => {
  before(() => {
    cy.server()
    cy.route({
      method: 'GET',
      url: '**/comments',
      status: 404,
      response: [],
    })
    cy.visit('/')
  })

  it(`Shows an Error message when the comments couldn't be fetched`, () => {
    cy.contains('An error occurred')
  })
})

describe('Comments Timeout Error', () => {
  beforeEach(() => {
    cy.server()
    cy.route({
      method: 'GET',
      url: '**/comments',
      delay: 3000,
      response: [
        {
          id: 1,
          title: 'comment 1',
          content: 'content 1...',
        },
        {
          id: 2,
          title: 'comment 2',
          content: 'content 2...',
        },
      ],
    })
    cy.visit('/')
  })

  it(`Shows an Error message when the comments couldn't be fetched`, () => {
    cy.contains('Request Timeout')
  })
})

describe('Comments Detail Expand Error', () => {
  before(() => {
    cy.server()
    cy.route({
      method: 'GET',
      url: '**/comments',
      response: [
        {
          id: 1,
          title: 'comment 1',
          content: 'content 1...',
        },
        {
          id: 2,
          title: 'comment 2',
          content: 'content 2...',
        },
      ],
    })
    cy.route({
      method: 'GET',
      url: '**/comments/1',
      status: 404,
      response: {},
    }).as('commentDetail1')
    cy.visit('/')
  })

  it(`Shows an Error message when the comments detail couldn't be fetched`, () => {
    cy.get('button[aria-label="Show more"]').first().click()
    cy.contains('An error occurred')
  })
})

describe('Comments Detail Timeout Error', () => {
  before(() => {
    cy.server()
    cy.route({
      method: 'GET',
      url: '**/comments',
      response: [
        {
          id: 1,
          title: 'comment 1',
          content: 'content 1...',
        },
        {
          id: 2,
          title: 'comment 2',
          content: 'content 2...',
        },
      ],
    })
    cy.route({
      method: 'GET',
      url: '**/comments/1',
      delay: 3000,
      response: {},
    }).as('commentDetail1')
    cy.visit('/')
  })

  it(`Shows an Error message when the comments detail couldn't be fetched`, () => {
    cy.get('button[aria-label="Show more"]').first().click()
    cy.contains('Request timeout')
  })
})
