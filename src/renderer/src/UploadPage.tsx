import { Group, Text, rem, Title } from '@mantine/core'
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react'
import { Dropzone, type DropzoneProps } from '@mantine/dropzone'
import { useState } from 'react'
import { LineChart } from '@mantine/charts'
import { read, utils } from 'xlsx'

export function UploadPage(props: Partial<DropzoneProps>) {
  const [file, setFile] = useState('')
  const [error, setFileError] = useState('')
  const max_m = 50
  const maxFilesize = max_m * 1024 ** 2
  const [data, setData] = useState([])

  return (
    <>
      <Dropzone
        maxFiles={1}
        onDrop={async (files) => {
          console.log('accepted files', files)
          setFile(files[0]?.path ?? '')
          if (files[0].name.endsWith('xlsx')) {
            const sheetName = 'SDD21'
            if (files[0].path === '') {
              const workbook = await read(await files[0].arrayBuffer())
              const worksheet = workbook.Sheets[sheetName]
              const data = utils.sheet_to_json(worksheet)
              // @ts-expect-error sheet_to_json returns unknown[] by default
              setData(data)
            } else {
              // @ts-expect-error exposed by preload (see src/preload/index.ts)
              const excelData = await window.electron.readExcelFile({
                path: files[0].path,
                sheet: sheetName
              })
              setData(excelData)
            }
          } else {
            setFileError('File must be an xlsx file')
          }
        }}
        onReject={(files) => {
          console.log('rejected files', files)
          if (files[0]) {
            setFile(files[0].file.name)
            setFileError(files[0].errors[0]?.message || '')
          }
        }}
        maxSize={maxFilesize}
        {...props}
      >
        <Group justify="center" gap="xl" style={{ minHeight: rem(220), pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload size="3.2rem" stroke={1.5} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size="3.2rem" stroke={1.5} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto size="3.2rem" stroke={1.5} />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Drag files here or click to select files
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
              each file should not exceed {max_m}mb
            </Text>
          </div>
        </Group>
      </Dropzone>
      {error.length > 0 && <Title>File Error: {error} </Title>}
      {data.length > 0 && (
        <LineChart
          h={300}
          data={data}
          dataKey="__EMPTY"
          series={[
            { name: 'TX2', color: 'red' },
            { name: 'TX3', color: 'green' },
            { name: 'TX4', color: 'yellow' },
            { name: 'RX1', color: 'purple' },
            { name: 'RX2', color: 'orange' },
            { name: 'RX3', color: 'pink' },
            { name: 'RX4', color: 'cyan' },
            { name: 'TX5', color: 'brown' }
          ]}
          curveType="linear"
        />
      )}
      <Title>File: {file}</Title>
    </>
  )
}
