import { useState, useEffect, createContext, Fragment } from 'react'
import { useRouter } from 'next/router'
import { kebabToTitleCase } from '@/utils/kebabToTitleCase'
import { UtilityTable } from '@/components/UtilityTable'

export const DocumentContext = createContext()

export function ContentsLayout({ children, meta, classes, tableOfContents }) {
  const router = useRouter()
  let [currentSection, setCurrentSection] = useState(tableOfContents[0]?.slug)
  let [atBottom, setAtBottom] = useState(false)
  let [atTop, setAtTop] = useState(true)

  useEffect(() => {
    if (tableOfContents.length === 0) return
    function onScroll() {
      const first = tableOfContents[0].slug
      const last = tableOfContents[tableOfContents.length - 1].slug
      if (!atTop && currentSection !== first && window.pageYOffset <= 0) {
        setAtTop(true)
        setCurrentSection(first)
      } else if (atTop && window.pageYOffset > 0) {
        setAtTop(false)
      } else if (
        !atBottom &&
        currentSection !== last &&
        window.pageYOffset + window.innerHeight >= document.body.scrollHeight
      ) {
        setAtBottom(true)
        setCurrentSection(last)
      } else if (atBottom && window.pageYOffset + window.innerHeight < document.body.scrollHeight) {
        setAtBottom(false)
      }
    }
    window.addEventListener('scroll', onScroll, {
      capture: true,
      passive: true,
    })
    return () => window.removeEventListener('scroll', onScroll, true)
  }, [atTop, atBottom, currentSection, tableOfContents])

  return (
    <DocumentContext.Provider value={{ currentSection, setCurrentSection, atTop, atBottom }}>
      <div className="pt-24 pb-16 lg:pt-28 w-full">
        <div className="markdown mb-6 px-6 max-w-3xl mx-auto lg:ml-0 lg:mr-auto xl:mx-0 xl:px-12 xl:w-3/4">
          <h1 className="flex items-center">
            {meta.title || kebabToTitleCase(router.pathname.split('/').pop())}
          </h1>
          <div className="mt-0 mb-4 text-gray-600">{meta.description}</div>
          {!classes && <hr className="my-8 border-b-2 border-gray-200" />}
        </div>
        <div className="flex">
          <div className="px-6 xl:px-12 w-full max-w-3xl mx-auto lg:ml-0 lg:mr-auto xl:mx-0 xl:w-3/4">
            {classes && <UtilityTable {...classes} />}
            {children}
          </div>
          <div className="hidden xl:text-sm xl:block xl:w-1/4 xl:px-6">
            <div className="flex flex-col justify-between overflow-y-auto sticky top-16 max-h-(screen-16) pt-12 pb-4 -mt-12">
              <div className="mb-8">
                <h5 className="text-gray-500 uppercase tracking-wide font-bold text-sm lg:text-xs">
                  On this page
                </h5>
                <ul className="mt-4 overflow-x-hidden">
                  {tableOfContents.map((section) => (
                    <Fragment key={section.slug}>
                      <li className="mb-2">
                        <a
                          href={`#${section.slug}`}
                          className={`block transition-fast hover:translate-r-2px hover:text-gray-900 font-medium ${
                            currentSection === section.slug
                              ? 'translate-r-2px text-gray-900'
                              : 'text-gray-600'
                          }`}
                        >
                          {section.title}
                        </a>
                      </li>
                      {section.children.map((subsection) => (
                        <li className="mb-2 ml-2" key={subsection.slug}>
                          <a
                            href={`#${subsection.slug}`}
                            className="block transition-fast hover:translate-r-2px hover:text-gray-900 text-gray-600 font-medium"
                          >
                            {subsection.title}
                          </a>
                        </li>
                      ))}
                    </Fragment>
                  ))}
                </ul>
              </div>
              <div id="ad" />
              <div id="tailwind-ui-widget">
                <a
                  href="https://tailwindui.com/?utm_source=tailwindcss&utm_medium=sidebar-widget"
                  className="mt-3 block"
                >
                  <img src="/img/tailwind-ui-sidebar.png" alt="Tailwind UI" />
                </a>
                <p className="mt-4 text-gray-700">
                  <a
                    href="https://tailwindui.com/?utm_source=tailwindcss&utm_medium=sidebar-widget"
                    className="text-gray-700"
                  >
                    Beautiful UI components by the creators of Tailwind CSS.
                  </a>
                </p>
                <div className="mt-2">
                  <a
                    href="https://tailwindui.com/?utm_source=tailwindcss&utm_medium=sidebar-widget"
                    className="text-sm text-gray-800 font-medium hover:underline"
                  >
                    Learn more →
                  </a>
                </div>
              </div>
              <div id="refactoring-ui-widget" style={{ display: 'none' }}>
                <a
                  href="https://refactoringui.com/book?utm_source=tailwindcss&utm_medium=sidebar-widget"
                  className="mt-3 block"
                >
                  <img src="/img/refactoring-ui-book.png" alt="" />
                </a>
                <p className="text-gray-700 text-center">
                  <a
                    href="https://refactoringui.com/book?utm_source=tailwindcss&utm_medium=sidebar-widget"
                    className="text-gray-700"
                  >
                    Learn UI design, from the creators of Tailwind CSS.
                  </a>
                </p>
                <div className="mt-3 text-center">
                  <a
                    href="https://refactoringui.com/book?utm_source=tailwindcss&utm_medium=sidebar-widget"
                    className="inline-block px-3 py-2 text-sm bg-indigo-500 text-white font-semibold rounded hover:bg-indigo-600"
                  >
                    Learn more →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DocumentContext.Provider>
  )
}
